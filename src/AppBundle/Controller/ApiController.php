<?php

namespace AppBundle\Controller;

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
class ApiController extends Controller
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

        return $this->json($data, $code, array('Content-Type: application/json'));
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
    public function getTimeSheetEntryList(Request $request)
    {
        $logger = new DebugStack();
        $this
            ->get('doctrine')
            ->getConnection()
            ->getConfiguration()
            ->setSQLLogger($logger);
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

        return $this->json($data, $status, array('Content-Type: application/json'));
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

        return $this->json($data, $status, array('Content-Type: application/json'));
    }

    /**
     * Get a list of all timesheets.
     *
     * @todo Paginate the results.
     *
     * @Route("/api/timesheet", name="api_timesheet_list")
     * @Method("GET")
     * @param Request $request
     * @param Int $id
     *
     * @return Response
     */
    public function getTimeSheetList(Request $request)
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

        return $this->json($data, $status, array('Content-Type: application/json'));
    }

}
