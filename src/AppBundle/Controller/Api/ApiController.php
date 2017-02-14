<?php

namespace AppBundle\Controller\Api;

use AppBundle\Api\ApiProblem;
use AppBundle\Api\ApiProblemException;
use AppBundle\Entity\TimeSheet;
use AppBundle\Entity\TimeSheetEntry;
use Doctrine\DBAL\Logging\DebugStack;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class ApiController
 * @package AppBundle\Controller
 */
class ApiController extends ApiBaseController
{
    /**
     * Get time sheet entry data
     *
     * @Route("/api/timesheet/entry/{id}", name="api_timesheet_entry_object")
     * @Method("GET")
     * @param Request $request
     * @param Int $id
     *
     * @return Response
     */
    public function getTimeSheetEntryAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $timeSheetEntry = $em->getRepository('AppBundle:TimeSheetEntry')->findOneBy(array('id' => $id));

        if($timeSheetEntry === null)
        {
            $data = array();
            $code = 404;
        } else {
            $code = 200;
            $data = $timeSheetEntry->serialize();
        }

        return $this->jsonResponse($data, $code);
    }

    /**
     * Get a list of all time sheet entries.
     *
     * @todo Paginate the results.
     *
     * @Route("/api/timesheet/entry", name="api_timesheet_entry_list")
     * @Method("GET")
     * @param Request $request
     *
     * @return Response
     */
    public function getTimeSheetEntryListAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $collection = $em->getRepository('AppBundle:TimeSheetEntry')
            ->findAll();


        $data = array();
        if ($collection) {
            foreach ($collection as $timeSheetEntry) {
                $data[] = $timeSheetEntry->serialize();
            }
            $status = 200;
        } else {
            $status = 404;
        }

        return $this->jsonResponse($data, $status);
    }

    /**
     * DELETE a time sheet entry.
     *
     * @Route("/api/timesheet/entry")
     * @Method("DELETE")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function deleteTimeSheetEntryAction(Request $request) {
        $data = $this->getDecodedJsonFromRequest($request);

        if (!property_exists($data, 'id')) {
            $this->problemResponse($this->getMissingDataProblem('id'));
        }

        $em = $this->getDoctrine()->getManager();
        $entity = $em->getReference('AppBundle:TimeSheetEntry', $data->id);
        $em->remove($entity);
        $em->flush();

        return $this->jsonResponse('', 204);
    }

    /**
     * POST new sheet entries or existing ones.
     *
     * @Route("/api/timesheet/entry", name="api_post_timesheet_entry")
     * @Method("POST")
     * @param Request $request
     *
     * @return Response
     */
    public function postTimeSheetEntryAction(Request $request) {
        $data = $this->getDecodedJsonFromRequest($request);

        $newEntries = array();

        $em = $this->getDoctrine()->getManager();


        //We need to get an array of TimeSheets stored by
        //their id so we can associate them in one go with
        //the given entries.
        $idsToGet = [];
        foreach($data as $row) {
            $this->assertDataMeetsRequirements('\AppBundle\Entity\TimeSheetEntry', $row);
            $idsToGet[] = $row->timeSheetId;
        }

        $timesheets = $em->getRepository('AppBundle:TimeSheet')
            ->findBy(['id' => $idsToGet]);

        $byId = [];

        foreach ($timesheets as $timesheet) {
            $byId[$timesheet->getId()] = $timesheet;
        }

        $timesheets = $byId;

        foreach ($data as $row) {
            /**
             * @type TimeSheetEntry
             */
            if (isset($row->id)) {
                $entry = $em->getReference('AppBundle\Entity\TimeSheetEntry', $row->id);
            } else {
                $entry = new TimeSheetEntry();
            }
            $row->timesheet = $timesheets[$row->timeSheetId];
            $entry->setData($row);
            $entry = $em->merge($entry);
            $newEntries[] = $entry;
        }

        $em->flush();

        //Create new data now that we can get the ids of the new time sheets.
        $data = [];

        foreach ($newEntries as $entry) {
            $data[] = $entry->serialize();
        }

        return $this->jsonResponse($data, 201);
    }

    /**
     * POST one or more new time sheets
     *
     * @Route("/api/timesheet", name="api_post_timesheet")
     * @Method("POST")
     * @param Request $request
     *
     * @return Response
     */
    public function postTimeSheetAction(Request $request) {

        $data = $this->getDecodedJsonFromRequest($request);

        $newTimeSheets = array();
        $em = $this->getDoctrine()->getManager();

        foreach ($data as $row) {
            $this->assertDataMeetsRequirements('\AppBundle\Entity\TimeSheet', $row);
            $timeSheet = new TimeSheet();
            $timeSheet->setBillTo($row->billTo);
            $em->persist($timeSheet);
            $newTimeSheets[] = $timeSheet;
        }

        $em->flush();

        //Create new data now that we can get the ids of the new time sheets.
        $data = [];

        foreach ($newTimeSheets as $timeSheet) {
            $data[] = $timeSheet->serialize();
        }

        return $this->jsonResponse($data, 201);
    }


    /**
     * Get a specific time sheet object
     *
     * @Route("/api/timesheet/{id}", name="api_timesheet_object")
     * @Method("GET")
     * @param Request $request
     * @param Int $id
     *
     * @return Response
     */
    public function getTimeSheetAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $timeSheet = $em->getRepository('AppBundle:TimeSheet')
            ->findOneBy(array('id' => $id));

        $data = array();

        if ($timeSheet) {
            $data = $timeSheet->serialize();
            $status = 200;
        } else {
            $status = 404;
        }

        return $this->jsonResponse($data, $status);
    }

    /**
     * Get a list of all time sheets.
     *
     * @todo Paginate the results.
     *
     * @Route("/api/timesheet", name="api_timesheet_list")
     * @Method("GET")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getTimeSheetListAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $collection = $em->getRepository('AppBundle:TimeSheet')
            ->findAll();

        $data = array();
        if ($collection) {
            foreach ($collection as $timeSheet) {
                $data[] = $timeSheet->serialize();
            }
            $status = 200;
        } else {
            $status = 404;
        }

        return $this->jsonResponse($data, $status);
    }
}
