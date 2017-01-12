<?php

namespace AppBundle\Controller;

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
     * Get time sheet data
     *
     * @Route("/api/timesheet", name="api_timesheet")
     * @Method("GET")
     * @param Request $request
     *
     * @return Response
     */
    public function getTimeSheetAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //Get the time sheet we are working with. Because this is just
        //practice, we use only one time sheet, the first one.
        $timeSheet = $em->getRepository('AppBundle:TimeSheet')
            ->getDefaultOrNew();

        return $this->json($timeSheet->serialize(), 200, array('Content-Type: application/json'));
    }
}
