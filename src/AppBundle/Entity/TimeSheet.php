<?php
/**
 * Created by PhpStorm.
 * User: cbrooks
 * Date: 12/30/16
 * Time: 11:57 AM
 */

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TimeSheetRepository")
 * @ORM\Table(name="time_sheet")
 */
class TimeSheet {

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\TimeSheetEntry", mappedBy="timeSheet")
     * @ORM\OrderBy({"createdAt"="ASC"})
     */
    private $entries;

    /**
     * @ORM\Column(type="text")
     */
    private $billTo;

    /**
     * TimeSheet constructor.
     */
    public function __construct() {
        //Our entries will start out empty
        $this->entries = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->billTo = '';
    }

    /**
     * @return integer
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
     * @return string
     */
    public function getBillTo() {
        return $this->billTo;
    }

    /**
     * @param string $billTo
     */
    public function setBillTo($billTo) {
        $this->billTo = $billTo;
    }

    /**
     * Add a time sheet entry to this time sheet.
     *
     * @param TimeSheetEntry $entry
     */
    public function addTimeSheetEntryAndSave(TimeSheetEntry $entry)
    {
        $entry->setTimeSheet($this);
    }

    /**
     * Get a collection of entries that belong to this time sheet.
     *
     * @return ArrayCollection|TimeSheetEntry[]
     */
    public function getEntries() {
        return $this->entries;
    }

    /**
     * Set data from the request.
     *
     * TODO: Allow for data to be pulled from POST.
     *
     * @param Request $request
     *
     * @return TimeSheet
     */
    public function setDataFromRequest(Request $request)
    {
        $this->setBillTo($request->query->get('billTo'));

        return $this;
    }

    public function serialize() {
        foreach ($this->getEntries() as $entry) {
            $entryData = $entry->serialize();
        }

        return  [
            'id' => $this->getId(),
            'billTo' => $this->getBillTo(),
            'entries' => $entryData,
            'createdAt' => $this->getCreatedAt()
        ];
    }
}
