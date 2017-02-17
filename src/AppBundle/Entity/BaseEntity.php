<?php

namespace AppBundle\Entity;


abstract class BaseEntity {
    /**
     * Return a list of required keys that do not exist in the given data.
     *
     * @param stdClass|array $data
     * @return array
     */
    abstract static function getMissingDataKeys($data);

    /**
     * Return an array of missing required keys in the given data.
     *
     * @param stdClass|array $data Data to search for the required keys.
     * @param array $required An array of keys that must exist in the data.
     *
     * @return array An array of keys that are missing in the data or an empty
     *               array if no keys are missing.
     */
    public static function getMissingDataRequirements($data, $required)
    {
        $missing = array();

        foreach ($required as $key) {
            $miss = null;
            if ($data instanceof stdClass) {
                if (!property_exists($data, $key)) {
                    $miss = $key;
                }
            } else {
                if (!array_key_exists($key, $data)) {
                    $miss = $key;
                }
            }

            if ($miss !== null) {
                $missing[] = $miss;
            }
        }

        return $missing;
    }
}
