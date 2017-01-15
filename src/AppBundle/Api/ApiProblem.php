<?php

namespace AppBundle\Api;
use Symfony\Component\Config\Definition\Exception\Exception;


/**
 * Class ApiProblem.
 *
 * Used for application/problem+json responses.
 *
 * See RFC 7807 https://tools.ietf.org/html/rfc7807
 *
 * @package AppBundle\Api
 */
class ApiProblem {

    const TYPE_INVALID_BODY = 'invalid_body_format';

    private static $titles = array(
        self::TYPE_INVALID_BODY => 'The JSON that was sent is invalid!'
    );

    private $title;

    private $statusCode;

    private $type;

    private $extraData = array();

    public function __construct($statusCode, $type) {
        $this->statusCode = $statusCode;
        $this->type = $type;

        if (!array_key_exists($type, self::$titles)) {
            throw new \InvalidArgumentException('No title for type '.$type);
        }

        $this->title = self::$titles[$type];
    }

    /**
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }

    /**
     * @return mixed
     */
    public function getStatusCode() {
        return $this->statusCode;
    }

    /**
     * Get a key/value pair in the problem's extra data.
     *
     * @param string $key
     *
     * @return mixed
     */
    public function get($key) {
        return $this->extraData;
    }

    /**
     * Set a key/value pair in the problem's extra data.
     *
     * @param string $key
     * @param mixed $value
     *
     * @return $this
     */
    public function set($key, $value) {
        $this->extraData[$key] = $value;

        return $this;
    }

    /**
     * Get the problem as an array.
     *
     * @return array
     */
    public function toArray() {
        return array_merge(
            $this->extraData,
            array(
                'status' => $this->statusCode,
                'type' => $this->type,
                'title' => $this->title
            )
        );
    }
}
