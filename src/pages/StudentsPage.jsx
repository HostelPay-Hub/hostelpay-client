import React, { useState, useEffect } from 'react';
import { studentAPI, leaseAPI, roomAPI } from '../api/endpoints';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Edit2, Trash2, Search, User, FileText, Image as ImageIcon, Home, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import CloudinaryUploadWidget from '../components/CloudinaryUploadWidget';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [leaseData, setLeaseData] = useState({
    roomId: '',
    agreedMonthlyRent: '',
    startDate: new Date().toISOString().split('T')[0],
    billingAnchorDate: 1
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dob: '',
    aadharUrl: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchRooms();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await roomAPI.getAll();
      setRooms(res.data);
    } catch (err) {}
  };

  const handleLeaseSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaseAPI.assign({
        ...leaseData,
        studentId: selectedStudent.id,
        agreedMonthlyRent: parseFloat(leaseData.agreedMonthlyRent)
      });
      setIsLeaseModalOpen(false);
      fetchStudents();
    } catch (err) {
      setError('Failed to assign room');
    }
  };

  const openLeaseModal = (student) => {
    setSelectedStudent(student);
    setIsLeaseModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSubmit = {
      ...formData,
      dob: formData.dob === "" ? null : formData.dob,
      aadharUrl: formData.aadharUrl === "" ? null : formData.aadharUrl
    };

    try {
      if (editingId) {
        await studentAPI.update(editingId, dataToSubmit);
      } else {
        await studentAPI.create(dataToSubmit);
      }
      setIsModalOpen(false);
      fetchStudents();
      setFormData({ fullName: '', phoneNumber: '', dob: '', aadharUrl: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.details || 'Operation failed');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const openEditModal = (student) => {
    setFormData({
      fullName: student.fullName,
      phoneNumber: student.phoneNumber,
      dob: student.dob || '',
      aadharUrl: student.aadharUrl || ''
    });
    setEditingId(student.id);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Directory</h2>
          <p className="text-slate-400 mt-1">Manage all students in your hostel.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ fullName: '', phoneNumber: '', dob: '', aadharUrl: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Student
        </button>
      </div>

      <div className="glass-dark rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Room</th>
                  <th className="p-4 font-medium">Added On</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 font-bold">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{student.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4">{student.phoneNumber}</td>
                      <td className="p-4">
                        {student.roomNumber ? (
                          <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-fit text-xs">
                            <Home size={12} className="mr-1" /> {student.roomNumber}
                          </div>
                        ) : (
                          <button 
                            onClick={() => openLeaseModal(student)}
                            className="flex items-center text-blue-400 hover:bg-blue-500/20 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 transition-all animate-pulse"
                          >
                            Assign Room
                          </button>
                        )}
                      </td>
                      <td className="p-4">{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(student)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Student' : 'Add New Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
            <input required type="text" name="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth (Optional)</label>
            <input type="date" name="dob" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-300 mb-2 italic">Identity Vault (Aadhar/ID)</label>
            {formData.aadharUrl ? (
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-blue-400" />
                  <span className="text-xs text-slate-300 truncate max-w-[150px]">Document Secured</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, aadharUrl: ''})}
                  className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <CloudinaryUploadWidget 
                onUploadSuccess={(url) => setFormData({...formData, aadharUrl: url})} 
                folder="student_ids"
              />
            )}
          </div>
          <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors">
            {editingId ? 'Update Student' : 'Save Student'}
          </button>
        </form>
      </Modal>

      {/* Room Allocation Modal */}
      <Modal isOpen={isLeaseModalOpen} onClose={() => setIsLeaseModalOpen(false)} title="Assign Student to Room">
        <form onSubmit={handleLeaseSubmit} className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Assigning Room For</p>
            <h4 className="text-xl font-bold text-white">{selectedStudent?.fullName}</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Select Room</label>
              <select 
                required 
                value={leaseData.roomId}
                onChange={(e) => {
                  const room = rooms.find(r => r.id === e.target.value);
                  setLeaseData({...leaseData, roomId: e.target.value, agreedMonthlyRent: room?.defaultPrice || ''});
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a room...</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>Room {room.roomNumber} ({room.capacity} beds)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Agreed Monthly Rent</label>
                <input 
                  required 
                  type="number" 
                  value={leaseData.agreedMonthlyRent}
                  onChange={(e) => setLeaseData({...leaseData, agreedMonthlyRent: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="₹"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Joining Date</label>
                <input 
                  required 
                  type="date" 
                  value={leaseData.startDate}
                  onChange={(e) => setLeaseData({...leaseData, startDate: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            Confirm Room Assignment <ArrowRight size={20} />
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
