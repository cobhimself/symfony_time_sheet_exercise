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
 */
class TimeSheetEntry {

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
     * Set data from the request.
     *
     * @param Request $request
     * @param TimeSheet|null $timeSheet The time sheet this entry belongs to.
     *                                  If null, no time sheet is set for this
     *                                  entry (useful for when updating).
     *  @return TimeSheetEntry
     */
    public function setDataFromRequest(Request $request, $timeSheet = null)
    {
        $this->setDescription($request->query->get('description'));
        $this->setHourlyPrice($request->query->get('hourlyPrice'));
        $this->setHours($request->query->get('hours'));

        if (!is_null($timeSheet))
        {
            $this->setTimeSheet($timeSheet);
        }

        return $this;
    }

}
