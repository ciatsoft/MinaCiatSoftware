namespace Common.Domain
{
    public abstract class Entity<T> : BaseObjectEntity
    {
        public T Id { get; protected set; }
    }
}
