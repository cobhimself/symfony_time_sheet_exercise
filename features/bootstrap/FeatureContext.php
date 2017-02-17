<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\MinkExtension\Context\MinkContext;
use Behat\Symfony2Extension\Context\KernelDictionary;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\Common\Util\Inflector;
use PHPUnit\Framework\Assert;
use Symfony\Bridge\Doctrine\DataFixtures\ContainerAwareLoader;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Defines application features from the specific context.
 */
class FeatureContext extends MinkContext implements Context {
    /**
     * This gives us access to the Symfony container.
     */
    use KernelDictionary;

    private $jsonData;
    private $postData;
    private $useBadData = false;
    private $entityIdToDelete;

    const acceptableNames = [
        'time sheet entry' => 'TimeSheetEntry',
        'time sheet' => 'TimeSheet'
    ];


    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct() {
    }

    /**
     * Load our fixtures.
     * @BeforeScenario @fixtures
     */
    public function loadFixtures() {
        //Load our data fixtures
        $loader = new ContainerAwareLoader($this->getContainer());
        $loader->loadFromDirectory(__DIR__ . '/../../src/AppBundle/DataFixtures/');

        //Purge the database.
        $purger = new ORMPurger($this->getEntityManager());
        $purger->setPurgeMode(ORMPurger::PURGE_MODE_TRUNCATE);

        //Execute them!
        $executor = new ORMExecutor($this->getEntityManager(), $purger);
        $this->setForeignKeyChecks(0);
        $executor->execute($loader->getFixtures());
        $this->setForeignKeyChecks(1);
    }

    private function setForeignKeyChecks($val) {
        /**
         * @type \Doctrine\DBAL\Connection
         */
        $dbConn = $this->getContainer()->get('doctrine')->getConnection();
        $dbConn->exec('SET FOREIGN_KEY_CHECKS=' . $val);
    }

    /**
     * @return \Doctrine\ORM\EntityManager
     */
    private function getEntityManager() {
        return $this->getContainer()->get('doctrine')->getManager();
    }

    /**
     * @Given /^I request "(GET|PUT|POST|DELETE) ([^"]*)"$/
     * @param $method
     * @param $uri
     * @throws Exception
     */
    public function iRequest($method, $uri) {
        $data = array();

        if (in_array($method, ['POST', 'DELETE'])) {
            if (!$this->postData) {
                throw new Exception('Cannot send post data when it is not set!');
            }
            if ($this->useBadData) {
                $data = $this->postData;
            } else {
                $data = json_encode($this->postData);
            }
        } else {
            $data = json_encode($data);
        }

        $this->getSession()
            ->getDriver()
            ->getClient()
            ->request($method, $uri, array(), array(), array(), $data);
//        $this->getSession()->visit($uri);
    }

    private function camelize($string) {
        return Inflector::camelize($string);
    }

    /**
     * @Given I have the following data:
     * @param TableNode $table
     */
    public function iHaveTheFollowingData(TableNode $table)
    {
        $hash = $table->getHash();
        $data = array();

        //Go through the hash and rename the keys to be camelized.
        foreach ($hash as $rowId => $row) {
            $data[$rowId] = array();
            foreach($row as $key => $value) {
                $data[$rowId][$this->camelize($key)] = $value;
            }
        }

        $this->postData = $data;
    }

    /**
     * @Then a(n) :prop property should exist
     * @param $prop
     */
    public function aPropertyShouldExist($prop) {
        $data = $this->getObjectFromJson();
        Assert::assertObjectHasAttribute(
            $this->camelize($prop),
            $data,
            'The ' . $prop . ' property does not exist!'
        );
    }

    /**
     * @Then the :key property should equal :value
     * @param $key
     * @param $value
     */
    public function thePropertyShouldEqual($key, $value) {
        $data = $this->getObjectFromJson();
        Assert::assertEquals($value, $data->$key);
    }

    public function getObjectFromJson() {
        if (!$this->jsonData) {
            $this->jsonData = json_decode($this->getSession()->getDriver()->getContent());
        }

        return $this->jsonData;
    }

    /**
     * Sets Kernel instance.
     *
     * @param KernelInterface $kernel
     * @return Kernel
     */
    public function setKernel(KernelInterface $kernel) {
        return $this->kernel = $kernel;
    }

    /**
     * @Then the list should contain more than one item
     */
    public function theListShouldContainMoreThanOneItem()
    {
        $data = $this->getObjectFromJson();
        Assert::assertGreaterThan(1, count($data), 'The list does not have more than one item!');
    }

    /**
     * @Then the :key data should be a list
     */
    public function theDataShouldBeAList($key)
    {
        $data = $this->getObjectFromJson();
        Assert::assertTrue(is_array($data->$key), $key.' data is not an array! Data:'.var_export($data->$key, true));
        Assert::assertObjectHasAttribute($key, $data, 'The data returned does not have a '.$key.' key. Data:'.var_export($data, true));
    }

    /**
     * @Then the :key data should contain more than one item
     */
    public function theDataShouldContainMoreThanOneItem($key)
    {
        $data = $this->getObjectFromJson();
        Assert::assertTrue(count($data->$key) > 1, 'The '.$key.' data does not contain more than one item.'.var_export($data->$key, true));
    }

    /**
     * @Then the data should be empty
     */
    public function theDataShouldBeEmpty() {
        Assert::assertEmpty($this->getObjectFromJson(), 'The json data is not empty!');
    }

    /**
     * @Then I should have a list of data
     */
    public function iShouldHaveAListOfData() {
        $data = $this->getObjectFromJson();
        Assert::assertTrue(
            is_array($data),
            'The returned data is not an array.'
        );
    }

    /**
     * @Then the list should contain :num entries
     */
    public function theListContainsEntries($num)
    {
        Assert::assertEquals($num, count($this->getObjectFromJson()));
    }

    /**
     * @Then the data should have values for the following:
     * @param PyStringNode $string
     */
    public function theDataShouldHaveValuesForTheFollowing(PyStringNode $string) {
        $data = $this->getObjectFromJson();
        foreach ($string as $key) {
            Assert::assertArrayHasKey(
                $this->camelize($key),
                $data,
                'The data does not contain a value for the key ' . $key
            );
        }
    }

    /**
     * @Then a :key property should equal:
     * @param $key
     * @param PyStringNode $string
     *
     * @throws Exception
     */
    public function aPropertyShouldEqual($key, PyStringNode $string) {
        $data = $this->getObjectFromJson();
        $key = $this->camelize($key);

        $rowString = $string->getStrings()[0];

        $actual = $this->getValueFromArrayOrObjectKey($data, $key);

        Assert::assertEquals($rowString, $actual);
    }

    /**
     * @Then a(n) :key property should equal :value
     * @param $key
     * @param $value
     */
    public function aPropertyShouldEqualInline($key, $value) {
        $data = $this->getObjectFromJson();
        $actual = $this->getValueFromArrayOrObjectKey(
            $data,
            $this->camelize($key)
        );

        Assert::assertEquals(
            $value,
            $actual,
            'The ' . $key . ' property does not equal ' . $value . '!'
        );
    }

    /**
     * @Given I have invalid json data
     */
    public function iHaveInvalidJsonData()
    {
        $this->postData = '{"bad_quote\': false;}';
        $this->useBadData = true;
    }

    /**
     * @Then the content type should be :type
     * @param $type
     */
    public function theContentTypeShouldBe($type)
    {
        Assert::assertEquals(
            $type,
            $this->getSession()->getResponseHeader('Content-Type'),
            'The content type is not '.$type
        );
    }

    /**
     *
     * @Then regarding item :num returned in the response
     * @throws TypeError
     */
    public function iRegardingItemInTheResponse($num)
    {
        //We need to do a fresh fetch of the object from json
        //so we can access a different index from it.
        $this->jsonData = null;
        $data = $this->getObjectFromJson();
        if (!is_array($data)) {
            throw new \TypeError('The data returned from the response is not an array!');
        }
        $this->jsonData = $data[$num-1];
    }

    /**
     * Get the value of the given key regardless of whether or not the given
     * data is an object or array.
     *
     * @param $data
     * @param $key
     *
     * @return mixed
     */
    private function getValueFromArrayOrObjectKey($data, $key) {
        if (is_array($data)) {
            $actual = $data[$key];
        } else if (is_object($data)) {
            $actual = $data->$key;
        }

        return $actual;
    }

    /**
     * Return the entity class name based upon the given human-readable entity name.
     *
     * @param String $entityName
     * @return String
     */
    private function _getEntityByHumanReadableName($entityName) {
        $acceptableNames = self::acceptableNames;

        if (!array_key_exists($entityName, $acceptableNames)) {
            throw new InvalidArgumentException('The given entity name "'.$entityName.'" is not a valid name! Try one of:'.join(',', $acceptableNames));
        }

        return self::acceptableNames[$entityName];
    }

    /**
     * @Given I set data using an existing :entityName id
     *
     * @param String $entityName The human-readable name of our entities
     */
    public function iSetDataUsingAnExistingId($entityName)
    {

        $entity = $this->getEntityManager()
            ->getRepository('AppBundle:'.$this->_getEntityByHumanReadableName($entityName))
            ->findFirstResult();

        Assert::assertNotNull($entity, 'No '.$entityName.' exists to get!');

        $this->entityIdToDelete = $entity->getId();

        $data = ['id' => $this->entityIdToDelete];

        $this->postData = $data;
    }

    /**
     * @Then a :entityName with the original id should not exist
     *
     * @param String $entityName The human-readable entity name.
     */
    public function aWithTheOriginalIdShouldNotExist($entityName)
    {
        $entity = $this->getEntityManager()->createQuery('
            SELECT e
            FROM AppBundle:?
            WHERE e.id = ?
        ')
        ->setParameter(0, $this->_getEntityByHumanReadableName($entityName))
        ->setParameter(1, $this->entityIdToDelete)
        ->getFirstResult();

        Assert::assertNull($entity, 'The entity with id '.$this->entityIdToDelete.' still exists!');
    }

    /**
     * @Then I die
     */
    public function iDie()
    {
        die;
    }
}
