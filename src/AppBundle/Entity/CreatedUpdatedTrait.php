<?php
/**
 * Created by PhpStorm.
 * User: cbrooks
 * Date: 1/16/17
 * Time: 9:44 AM
 */

namespace AppBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

trait CreatedUpdatedTrait {
    /**
     * Set the created and updated at properties at pre-persist.
     *
     * @ORM\PrePersist()
     */
    public function setCreatedAndUpdatedAtPrePersist() {
        if (property_exists(self::class, 'createdAt')) {
            $this->createdAt = new \DateTime('now');
        }
        $this->setUpdatedAtPreUpdateAndPersist();
    }

    /**
     * Set the updated at property at pre-persist.
     *
     * @ORM\PreUpdate()
     * @ORM\PrePersist()
     */
    public function setUpdatedAtPreUpdateAndPersist() {
        if (property_exists(self::class, 'updatedAt')) {
            $this->updatedAt = new \DateTime('now');
        }
    }
}
