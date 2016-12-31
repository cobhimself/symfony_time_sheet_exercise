<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class DefaultController
 * @package AppBundle\Controller
 */
class DefaultController extends Controller
{

    /**
     * Show a time sheet and it's entries.
     *
     * @Route("/", name="homepage")
     * @param Request $request
     *
     * @return Response
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        //Get the time sheet we are working with. Because this is just
        //practice, we use only one time sheet, the first one.
        $timeSheet = $em->getRepository('AppBundle:TimeSheet')
            ->getDefaultOrNew();

        //Get the time sheet entries
        $entries = $timeSheet->getEntries();

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'timeSheet' => $timeSheet,
            'entries' => $entries,
        ]);
    }
}
