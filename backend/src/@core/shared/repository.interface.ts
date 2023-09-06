export interface IRepository<T> {
    getAll(): Promise<T[]>
    findOneById(id: string): Promise<T | null>
    createOne(data: Omit<T, 'id'>): Promise<T>
    save(data: T): Promise<T>
    deleteById(id: string): Promise<T | null>

}