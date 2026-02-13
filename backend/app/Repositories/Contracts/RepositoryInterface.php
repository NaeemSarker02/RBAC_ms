<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface RepositoryInterface
{
    /**
     * Get all records.
     *
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * Get paginated records.
     *
     * @param int $perPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    /**
     * Find a record by ID.
     *
     * @param int $id
     * @param array $columns
     * @return Model|null
     */
    public function find(int $id, array $columns = ['*']): ?Model;

    /**
     * Find a record by ID or fail.
     *
     * @param int $id
     * @param array $columns
     * @return Model
     */
    public function findOrFail(int $id, array $columns = ['*']): Model;

    /**
     * Find a record by a specific column.
     *
     * @param string $column
     * @param mixed $value
     * @param array $columns
     * @return Model|null
     */
    public function findBy(string $column, $value, array $columns = ['*']): ?Model;

    /**
     * Find records by multiple criteria.
     *
     * @param array $criteria
     * @param array $columns
     * @return Collection
     */
    public function findWhere(array $criteria, array $columns = ['*']): Collection;

    /**
     * Create a new record.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Update a record.
     *
     * @param int $id
     * @param array $data
     * @return Model
     */
    public function update(int $id, array $data): Model;

    /**
     * Delete a record.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Force delete a record.
     *
     * @param int $id
     * @return bool
     */
    public function forceDelete(int $id): bool;

    /**
     * Restore a soft deleted record.
     *
     * @param int $id
     * @return bool
     */
    public function restore(int $id): bool;

    /**
     * Count records.
     *
     * @return int
     */
    public function count(): int;

    /**
     * Check if a record exists.
     *
     * @param int $id
     * @return bool
     */
    public function exists(int $id): bool;

    /**
     * Get records with relationships.
     *
     * @param array $relations
     * @return Collection
     */
    public function with(array $relations): Collection;

    /**
     * Order records by a column.
     *
     * @param string $column
     * @param string $direction
     * @return self
     */
    public function orderBy(string $column, string $direction = 'asc'): self;
}