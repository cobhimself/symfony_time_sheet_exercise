<?php

namespace AppBundle\Repository;

use AppBundle\Entity\TimeSheet;

class TimeSheetRepository extends BaseRepository {

    /**
     * Get the default time sheet or generate a new one.
     *
     * Because this is a practice exercise, we're not going to add functionality
     * to create new time sheets at this time.
     *
     * @return TimeSheet
     */
    public function getDefaultOrNew() {

        $result = $this->findFirstResult();

        if (!$result) {
            //Our default timesheet does not exist. Create it.
            $timeSheet = new TimeSheet();
            $em = $this->getEntityManager();

            $em->persist($timeSheet);
            $em->flush();

            $result = $timeSheet;
        }

        return $result;
    }
}
