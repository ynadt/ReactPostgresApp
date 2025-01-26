import React, { useState, useEffect, useCallback } from 'react';
import { fetchUsers, blockUsers, unblockUsers, deleteUsers } from '../api/users';
import { User } from '../types/User';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaLock, FaLockOpen, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa'; // FaSort for neutral icon
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { sortArray } from '../utils/sortUtils';
import { handleApiError } from '../utils/errorHandler';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' | null }>({ key: 'id', direction: null });
    const [loading, setLoading] = useState(true);
    const { logout, getToken } = useAuth();

    const token = getToken();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(token as string);
      setUsers(data);
    } catch (err) {
      handleApiError(err, logout);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((user) => user.id));
    }
  };

  const handleBlock = () => {
    void (async () => {
      try {
        await blockUsers(token as string, selectedIds);
        toast.success('User(s) blocked successfully');
        setSelectedIds([]);
        void loadUsers();
      } catch (err) {
        handleApiError(err, logout);
      }
    })();
  };

  const handleUnblock = () => {
    void (async () => {
      try {
        await unblockUsers(token as string, selectedIds);
        toast.success('User(s) unblocked successfully');
        setSelectedIds([]);
        void loadUsers();
      } catch (err) {
        handleApiError(err, logout);
      }
    })();
  };

  const handleDelete = () => {
    void (async () => {
      try {
        await deleteUsers(token as string, selectedIds);
        toast.success('User(s) deleted successfully');
        setSelectedIds([]);
        void loadUsers();
      } catch (err) {
        handleApiError(err, logout);
      }
    })();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handleSort = (key: keyof User) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    const sortedUsers = sortArray(users, key, direction);
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filter) || user.email.toLowerCase().includes(filter)
  );

  const renderSortIcon = (key: keyof User) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Admin Panel</h1>
        <button className="btn btn-danger" onClick={logout}>
          Sign Out
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Filter by name or email"
              className="form-control"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <button className="btn btn-secondary me-2" onClick={toggleSelectAll}>
                {selectedIds.length === users.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                className="btn btn-warning me-2"
                onClick={handleBlock}
                disabled={selectedIds.length === 0}
              >
                <FaLock />
                Block
              </button>
              <button
                className="btn btn-success me-2"
                onClick={handleUnblock}
                disabled={selectedIds.length === 0}
              >
                <FaLockOpen />
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="mt-3">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === users.length && users.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>
                    <span onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                      Name {renderSortIcon('name')}
                    </span>
                  </th>
                  <th>
                    <span onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                      Email {renderSortIcon('email')}
                    </span>
                  </th>
                  <th>
                    <span onClick={() => handleSort('last_login')} style={{ cursor: 'pointer' }}>
                      Last Login {renderSortIcon('last_login')}
                    </span>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center mt-3">
                            <p>No users found.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPanel;
