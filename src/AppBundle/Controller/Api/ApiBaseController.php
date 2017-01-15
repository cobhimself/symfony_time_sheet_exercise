<?php
namespace AppBundle\Controller\Api;


use AppBundle\Api\ApiProblem;
use AppBundle\Api\ApiProblemException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

abstract class ApiBaseController extends Controller {
    /**
     * Send a json Response.
     *
     * @param $data
     * @param $statusCode
     * @param string $contentType If provided, send this as the content type
     *                            instead of the default 'application/json'
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    protected function jsonResponse($data, $statusCode, $contentType = 'application/json') {
        return $this->json($data, $statusCode, array('Content-Type: '.$contentType));
    }

    /**
     * Get an invalid json error problem.
     *
     * @param array $errors An array of error messages to associate with the problem.
     *
     * @return ApiProblem
     */
    protected function getInvalidJsonProblem($errors = array()) {
        $problem = new ApiProblem(400, ApiProblem::TYPE_INVALID_BODY);
        $problem->set('errors', $errors);

        return $problem;
    }

    /**
     * Send the given problem as a response.
     *
     * @param ApiProblem $problem
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    protected function problemResponse($problem) {
        return $this->jsonResponse(
            $problem->toArray(),
            $problem->getStatusCode(),
            'application/problem+json'
        );
    }

    protected function getDecodedJsonFromRequest(Request $request) {
        
        $data = json_decode($request->getContent());

        //Was the data invalid?
        if (!$data) {
            $problem = $this->getInvalidJsonProblem();
            throw new ApiProblemException($problem);
        }

        return $data;
    }
}
