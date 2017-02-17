<?php
namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

class BaseRepository extends EntityRepository {
    /**
     * @return null|object
     */
    public function findFirstResult() {
        return $this->findOneBy(array());
    }
}
