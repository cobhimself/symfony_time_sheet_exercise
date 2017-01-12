<?php

use Behat\Behat\Context\Context;
use Behat\MinkExtension\Context\MinkContext;
use Behat\Symfony2Extension\Context\KernelDictionary;
use Doctrine\Common\Util\Inflector;
use PHPUnit\Framework\Assert;
use Symfony\Bridge\Doctrine\DataFixtures\ContainerAwareLoader;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelInterface;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;

/**
 * Defines application features from the specific context.
 */
class FeatureContext extends MinkContext implements Context
{
    /**
     * This gives us access to the Symfony container.
     */
    use KernelDictionary;

    private $jsonData;

    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct()
    {
    }

    /**
     * @BeforeScenario
     */
    public function clearData()
    {
//        $em = {};
//        $em->createQuery('DELETE FROM AppBundle:TimeSheet')->execute();
//        $em->createQuery('DELETE FROM AppBundle:TimeSheetEnry')->execute();
    }

    /**
     * Load our fixtures.
     * @BeforeScenario @fixtures
     */
    public function loadFixtures() {
        //Load our data fixtures
        $loader = new ContainerAwareLoader($this->getContainer());
        $loader->loadFromDirectory(__DIR__.'/../../src/AppBundle/DataFixtures/');

        $purger = new ORMPurger($this->getEntityManager());

        //Execute them!
        $executor = new ORMExecutor($this->getEntityManager(), $purger);
        $executor->execute($loader->getFixtures());
    }

    private function getEntityManager()
    {
        return $this->getContainer()->get('doctrine')->getManager();
    }

    /**
     * @Given /^I request "(GET|PUT|POST|DELETE) ([^"]*)"$/
     * @param $method
     * @param $uri
     */
    public function iRequest($method, $uri)
    {
//        $driver = new GoutteDriver();
//        $request = $driver->getClient()->request($parts[0], $parts[1]);
        $this->getSession()->visit($uri);
    }

    /**
     * @Then a(n) :prop property should exist
     */
    public function aPropertyShouldExist($prop)
    {
        $data = $this->getObjectFromJson();
        Assert::assertObjectHasAttribute(
            Inflector::camelize($prop),
            $data,
            'The '.$prop.' property does not exist!'
        );
    }

    /**
     * @Then the :key property should equal :value
     */
    public function thePropertyShouldEqual($key, $value)
    {
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
}
