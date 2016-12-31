<?php

namespace AppBundle\Controller;

use AppBundle\Entity\TimeSheet;
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
class TimeSheetController extends Controller
{
    /**
     * Update a time sheet.
     *
     * @Route(
     *     "/timesheet/{id}/update",
     *     name="timesheet_update",
     * )
     * @Method("Get")
     *
     * @param Request $request
     * @param TimeSheet $timeSheet
     *
     * @return JsonResponse JSON that provides a 'success' boolean. If the time
     *                      sheet was not updated successfully, an 'error' key
     *                      is provided with an error message.
     */
    public function updateTimeSheetAction(Request $request, TimeSheet $timeSheet)
    {
        $timeSheet->setDataFromRequest($request);

        $em = $this->getDoctrine()->getManager();
        $em->persist($timeSheet);

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
