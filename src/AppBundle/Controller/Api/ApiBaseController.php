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
     * Get a Missing Data Problem.
     *
     * @param array|string $missing An array of missing API keys.
     *
     * @return ApiProblem
     */
    protected function getMissingDataProblem($missing) {
        $problem = new ApiProblem(422, ApiProblem::TYPE_MISSING_DATA);
        $problem->set('missing', $missing);

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

    /**
     * Get the content of the request and decode it into JSON.
     *
     * @param Request $request
     * @return mixed
     */
    protected function getDecodedJsonFromRequest(Request $request) {
        
        $data = json_decode($request->getContent());

        //Was the data invalid?
        if (!$data) {
            $problem = $this->getInvalidJsonProblem();
            throw new ApiProblemException($problem);
        }

        return $data;
    }

    /**
     * Verify the given data meets the requirements for the given class.
     *
     * @param String $class The class name.
     * @param \stdClass|array $data
     */
    protected function assertDataMeetsRequirements($class, $data) {
        $missing = $class::getMissingDataKeys($data);
        if (!empty($missing)) {
            throw new ApiProblemException($this->getMissingDataProblem($missing));
        }
    }
}
