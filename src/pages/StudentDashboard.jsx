import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { studentAPI } from '../api/endpoints';

export default function StudentDashboard() {
  const { user, hostelId, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dob: '',
    aadharUrl: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await studentAPI.getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await studentAPI.updateStudent(editingId, formData.fullName, formData.phoneNumber, formData.dob, formData.aadharUrl);
      } else {
        await studentAPI.createStudent(formData.fullName, formData.phoneNumber, formData.dob, formData.aadharUrl);
      }
      setFormData({ fullName: '', phoneNumber: '', dob: '', aadharUrl: '' });
      setEditingId(null);
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      setError('Failed to save student: ' + (err.message || 'Unknown error'));
    }
  };

  const handleEdit = (student) => {
    setFormData({
      fullName: student.fullName,
      phoneNumber: student.phoneNumber,
      dob: student.dob,
      aadharUrl: student.aadharUrl,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleCancel = () => {
    setFormData({ fullName: '', phoneNumber: '', dob: '', aadharUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HostelPay Hub</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-700 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Active Hostel</p>
            <p className="text-lg font-semibold text-gray-800">{hostelId}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">User Role</p>
            <p className="text-lg font-semibold text-gray-800">{user?.role || 'Owner'}</p>
          </div>
        </div>

        {/* Add Student Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          {!showForm && (
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Students</h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                + Add Student
              </button>
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {editingId ? 'Edit Student' : 'Add New Student'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Aadhar Document URL
                    </label>
                    <input
                      type="url"
                      name="aadharUrl"
                      value={formData.aadharUrl}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/aadhar.pdf"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-semibold"
                  >
                    {editingId ? 'Update Student' : 'Add Student'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No students yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Add First Student
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        DOB
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.phoneNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.dob ? new Date(student.dob).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                            student.isActive ? 'bg-green-500' : 'bg-gray-500'
                          }`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
