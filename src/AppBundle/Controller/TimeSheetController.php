<?php

namespace AppBundle\Controller;

use AppBundle\Entity\TimeSheet;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class DefaultController
 * @package AppBundle\Controller
 */
class TimeSheetController extends Controller
{

    /**
     * Get a generated PDF of the timesheet
     *
     * @Route("/get/pdf/{id}", name="generate_pdf")
     *
     * @param Request $request
     * @param TimeSheet $timeSheet
     *
     * @return Response
     */
    public function getPDFAction(Request $request, TimeSheet $timeSheet)
    {
        $html = $this->render('pdf/index.html.twig', array(
            'timeSheet'  => $timeSheet
        ));

        return new Response(
            $this->get('knp_snappy.pdf')->getOutputFromHtml($html),
            200,
            array(
                'Content-Type'          => 'application/pdf',
                'Content-Disposition'   => 'attachment; filename="file.pdf"'
            )
        );
    }
}
