<?php
/**
 * Represents a time sheet entry.
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\Date;

/**
 * Class TimeSheetEntry
 *
 * @package AppBundle\Entity
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TimeSheetEntryRepository")
 * @ORM\Table(name="time_sheet_entry")
 * @ORM\HasLifecycleCallbacks
 */
class TimeSheetEntry extends BaseEntity {

    use CreatedUpdatedTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\TimeSheet", inversedBy="entries")
     * @ORM\JoinColumn(nullable=false)
     */
    private $timeSheet;

    /**
     * @ORM\Column(type="float")
     */
    private $hours;

    /**
     * @ORM\Column(type="string")
     */
    private $description;

    /**
     * @ORM\Column(type="float")
     */
    private $hourlyPrice;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * @return int
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getCreatedAt() {
        return $this->createdAt;
    }

    /**
     * @return TimeSheet
     */
    public function getTimeSheet() {
        return $this->timeSheet;
    }

    /**
     * @param TimeSheet $timeSheet
     */
    public function setTimeSheet(TimeSheet $timeSheet) {
        $this->timeSheet = $timeSheet;
    }

    /**
     * @return string
     */
    public function getDescription() {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description) {
        $this->description = $description;
    }

    /**
     * @return float
     */
    public function getHourlyPrice() {
        return $this->hourlyPrice;
    }

    /**
     * @param float $hourly_price
     */
    public function setHourlyPrice($hourly_price) {
        $this->hourlyPrice = $hourly_price;
    }

    /**
     * Return the total cost amount for this entry.
     *
     * @return float
     */
    public function getTotal()
    {
        return $this->hourlyPrice * $this->hours;
    }

    /**
     * @return float
     */
    public function getHours() {
        return $this->hours;
    }

    /**
     * @param float $hours
     */
    public function setHours($hours) {
        $this->hours = $hours;
    }

    /**
     * Set the data on this TimeSheetEntry based on the attributes of
     * the given object.
     *
     * @param \stdClass $object
     *
     * @return $this
     */
    public function setData(\stdClass $object) {
        $this->setDescription($object->description);
        $this->setHourlyPrice($object->hourlyPrice);
        $this->setHours($object->hours);

        if (property_exists($object, 'timesheet'))
        {
            if (!$object->timesheet instanceof TimeSheet) {
                throw new \InvalidArgumentException('The timesheet property of the data sent is not a TimeSheetEntry!');
            }

            $this->setTimeSheet($object->timesheet);
        }

        return $this;
    }

    /**
     * Return an array of data for this timesheet.
     */
    public function serialize() {
        $data = [
            'id' => $this->getId(),
            'timeSheetId' => $this->getTimeSheet()->getId(),
            'createdAt' => $this->getCreatedAt()->format('Y-m-d H:i:s'),
            'description' => $this->getDescription(),
            'hourlyPrice' => $this->getHourlyPrice(),
            'hours' => $this->getHours()
        ];

        return $data;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt() {
        return $this->updatedAt;
    }

    /**
     * @inheritdoc
     */
    public static function getMissingDataKeys($data) {
        return parent::getMissingDataRequirements($data, [
            'timeSheetId', 'description', 'hourlyPrice', 'hours'
        ]);
    }
}
