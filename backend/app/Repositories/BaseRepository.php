<?php

namespace App\Repositories;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements RepositoryInterface
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records.
     *
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->get($columns);
    }

    /**
     * Get paginated records.
     *
     * @param int $perPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->paginate($perPage, $columns);
    }

    /**
     * Find a record by ID.
     *
     * @param int $id
     * @param array $columns
     * @return Model|null
     */
    public function find(int $id, array $columns = ['*']): ?Model
    {
        return $this->model->find($id, $columns);
    }

    /**
     * Find a record by ID or fail.
     *
     * @param int $id
     * @param array $columns
     * @return Model
     */
    public function findOrFail(int $id, array $columns = ['*']): Model
    {
        return $this->model->findOrFail($id, $columns);
    }

    /**
     * Find a record by a specific column.
     *
     * @param string $column
     * @param mixed $value
     * @param array $columns
     * @return Model|null
     */
    public function findBy(string $column, $value, array $columns = ['*']): ?Model
    {
        return $this->model->where($column, $value)->first($columns);
    }

    /**
     * Find records by multiple criteria.
     *
     * @param array $criteria
     * @param array $columns
     * @return Collection
     */
    public function findWhere(array $criteria, array $columns = ['*']): Collection
    {
        $query = $this->model->newQuery();

        foreach ($criteria as $column => $value) {
            $query->where($column, $value);
        }

        return $query->get($columns);
    }

    /**
     * Create a new record.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update a record.
     *
     * @param int $id
     * @param array $data
     * @return Model
     */
    public function update(int $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);
        return $record->fresh();
    }

    /**
     * Delete a record.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $record = $this->findOrFail($id);
        return $record->delete();
    }

    /**
     * Force delete a record.
     *
     * @param int $id
     * @return bool
     */
    public function forceDelete(int $id): bool
    {
        $record = $this->model->withTrashed()->findOrFail($id);
        return $record->forceDelete();
    }

    /**
     * Restore a soft deleted record.
     *
     * @param int $id
     * @return bool
     */
    public function restore(int $id): bool
    {
        $record = $this->model->withTrashed()->findOrFail($id);
        return $record->restore();
    }

    /**
     * Count records.
     *
     * @return int
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Check if a record exists.
     *
     * @param int $id
     * @return bool
     */
    public function exists(int $id): bool
    {
        return $this->model->where('id', $id)->exists();
    }

    /**
     * Get records with relationships.
     *
     * @param array $relations
     * @return Collection
     */
    public function with(array $relations): Collection
    {
        return $this->model->with($relations)->get();
    }

    /**
     * Order records by a column.
     *
     * @param string $column
     * @param string $direction
     * @return self
     */
    public function orderBy(string $column, string $direction = 'asc'): self
    {
        $this->model = $this->model->orderBy($column, $direction);
        return $this;
    }

    /**
     * Reset the model instance.
     *
     * @return void
     */
    protected function resetModel(): void
    {
        $this->model = app($this->model);
    }
}