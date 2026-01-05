using Microsoft.EntityFrameworkCore;
using Spa_Salon_BackEnd.Domain.Entities;
using Spa_Salon_BackEnd.Domain.Interfaces;
using Spa_Salon_BackEnd.Infrastructure.Data;

namespace Spa_Salon_BackEnd.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .Include(u => u.Customer)
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(u => u.Customer)
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public override async Task<User?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(u => u.Customer)
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}
