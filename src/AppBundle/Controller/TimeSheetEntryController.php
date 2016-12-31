<?php

namespace AppBundle\Controller;

use AppBundle\Entity\TimeSheet;
use AppBundle\Entity\TimeSheetEntry;
use Doctrine\ORM\ORMException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class DefaultController
 * @package AppBundle\Controller
 */
class TimeSheetEntryController extends Controller
{
    /**
     * Add a time sheet entry.
     *
     * @Route(
     *     "/entry/add/{id}",
     *     name="entry_add_new",
     * )
     * @Method("Get")
     *
     * @param Request $request
     * @param TimeSheet $timeSheet
     *
     * @return JsonResponse JSON that provides a 'success' boolean. If the entry
     *                      was added successfully, a 'timeSheetEntryId' key
     *                      contains the id of the newly created time sheet
     *                      entry. Otherwise, an 'error' key is provided with
     *                      an error message.
     */
    public function addEntryAction(Request $request, TimeSheet $timeSheet)
    {

        $entry = new TimeSheetEntry();

        $entry->setDataFromRequest($request, $timeSheet);

        $em = $this->getDoctrine()->getManager();
        $em->persist($entry);

        $error = false;

        try {
            $em->flush();
            $success = true;
        } catch (ORMException $e) {
            $success = false;
            $error = $e->getMessage();
        }

        $data = ['success' => $success];

        if (!$success)
        {
            $data['error'] = $error;
        } else {
            $data['timeSheetEntryId'] = $entry->getId();
        }

        return $this->json($data);
    }

    /**
     * Delete a time sheet entry.
     *
     * @Route(
     *     "/entry/{id}/delete",
     *     name="entry_delete",
     * )
     * @Method("Get")
     *
     * @param Request $request
     * @param TimeSheetEntry $timeSheetEntry The TimeSheetEntry to be deleted.
     *
     * @return JsonResponse JSON that provides a 'success' boolean. If the entry
     *                      was not removed successfully, an 'error' key is
     *                      provided with an error message.
     */
    public function deleteEntryAction(Request $request, TimeSheetEntry $timeSheetEntry)
    {
        $em = $this->getDoctrine()->getManager();
        $em->remove($timeSheetEntry);

        $error = false;

        try {
            $em->flush();
            $success = true;
        } catch (ORMException $e) {
            $success = false;
            $error = $e->getMessage();
        }

        $data = ['success' => $success];

        if (!$success)
        {
            $data['error'] = $error;
        }

        return $this->json($data);

    }

    /**
     * Update a time sheet entry.
     *
     * @Route(
     *     "/entry/{id}/update",
     *     name="entry_update",
     * )
     * @Method("Get")
     *
     * @param Request $request
     * @param TimeSheetEntry $timeSheetEntry
     * @return JsonResponse JSON that provides a 'success' boolean. If the entry
     *                      was not updated successfully, an 'error' key is
     *                      provided with an error message.
     */
    public function updateEntryAction(Request $request, TimeSheetEntry $timeSheetEntry)
    {
        $timeSheetEntry->setDataFromRequest($request);

        $em = $this->getDoctrine()->getManager();
        $em->persist($timeSheetEntry);

        $error = false;

        try {
            $em->flush();
            $success = true;
        } catch (ORMException $e) {
            $success = false;
            $error = $e->getMessage();
        }

        $data = ['success' => $success];

        if (!$success)
        {
            $data['error'] = $error;
        }

        return $this->json($data);
    }
}
