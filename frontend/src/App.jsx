import React, { useState, useEffect } from 'react';
import { Calendar, Users, Briefcase, FileText, Plus, Search, DollarSign, Clock, CheckCircle, AlertCircle, X, Edit2, Trash2, Phone, Mail, MapPin, User, ChevronDown, Save, Filter } from 'lucide-react';

// API Base URL
const API_BASE = 'http://localhost:5001/api';

// API Service
const api = {
  customers: {
    getAll: () => fetch(`${API_BASE}/customers`).then(r => r.json()),
    getById: (id) => fetch(`${API_BASE}/customers/${id}`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' })
  },
  jobs: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/jobs${query ? '?' + query : ''}`).then(r => r.json());
    },
    getById: (id) => fetch(`${API_BASE}/jobs/${id}`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' })
  },
  invoices: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetch(`${API_BASE}/invoices${query ? '?' + query : ''}`).then(r => r.json());
    },
    getById: (id) => fetch(`${API_BASE}/invoices/${id}`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/invoices/${id}`, { method: 'DELETE' })
  },
  technicians: {
    getAll: () => fetch(`${API_BASE}/technicians`).then(r => r.json()),
    getById: (id) => fetch(`${API_BASE}/technicians/${id}`).then(r => r.json()),
    create: (data) => fetch(`${API_BASE}/technicians`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    update: (id, data) => fetch(`${API_BASE}/technicians/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    delete: (id) => fetch(`${API_BASE}/technicians/${id}`, { method: 'DELETE' })
  }
};

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, jobsData, invoicesData, techniciansData] = await Promise.all([
        api.customers.getAll(),
        api.jobs.getAll(),
        api.invoices.getAll(),
        api.technicians.getAll()
      ]);
      setCustomers(customersData);
      setJobs(jobsData);
      setInvoices(invoicesData);
      setTechnicians(techniciansData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType('');
  };

  const handleSave = async (data) => {
    try {
      if (modalType === 'customer') {
        if (selectedItem) {
          await api.customers.update(selectedItem.id, data);
        } else {
          await api.customers.create(data);
        }
      } else if (modalType === 'job') {
        if (selectedItem) {
          await api.jobs.update(selectedItem.id, data);
        } else {
          await api.jobs.create(data);
        }
      } else if (modalType === 'invoice') {
        if (selectedItem) {
          await api.invoices.update(selectedItem.id, data);
        } else {
          await api.invoices.create(data);
        }
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (type === 'customer') await api.customers.delete(id);
      else if (type === 'job') await api.jobs.delete(id);
      else if (type === 'invoice') await api.invoices.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid rgba(255,255,255,0.1)', 
            borderTop: '4px solid #00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ fontSize: '18px', opacity: 0.7 }}>Loading FieldFlow...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: '"Outfit", -apple-system, sans-serif',
      background: '#0a0e27',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .card {
          animation: slideIn 0.4s ease-out;
        }
        
        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover {
          background: rgba(0, 212, 255, 0.1);
          transform: translateX(8px);
        }
        
        .nav-item.active {
          background: linear-gradient(90deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.05));
          border-left: 3px solid #00d4ff;
        }
        
        .btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .btn:active::before {
          width: 300px;
          height: 300px;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 212, 255, 0.3);
        }
        
        .status-badge {
          animation: fadeIn 0.3s ease;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.5);
        }
      `}</style>

      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: 'linear-gradient(180deg, #12182e 0%, #0a0e27 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo */}
        <div style={{ 
          padding: '32px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            fontFamily: '"Space Mono", monospace'
          }}>
            FieldFlow
          </div>
          <div style={{ 
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '4px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '500'
          }}>
            Service Management
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '24px 0' }}>
          {[
            { id: 'dashboard', icon: Briefcase, label: 'Dashboard' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'jobs', icon: Briefcase, label: 'Jobs' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'invoices', icon: FileText, label: 'Invoices' },
          ].map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 24px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                color: activeView === item.id ? '#00d4ff' : 'rgba(255, 255, 255, 0.7)',
                margin: '0 12px 4px',
                borderRadius: '12px'
              }}
            >
              <item.icon size={20} style={{ marginRight: '14px' }} />
              {item.label}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ 
          padding: '20px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            A
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Admin User</div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>admin@fieldflow.com</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ 
          padding: '24px 40px',
          background: 'linear-gradient(90deg, rgba(18, 24, 46, 0.8), rgba(10, 14, 39, 0.9))',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '600',
              marginBottom: '4px',
              letterSpacing: '-0.5px'
            }}>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.5)' 
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '10px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#00ff9d' }}>
                  ${invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                </div>
              </div>
              <DollarSign size={24} style={{ color: '#00ff9d' }} />
            </div>
            <button
              className="btn"
              onClick={() => openModal(activeView === 'customers' ? 'customer' : activeView === 'jobs' ? 'job' : 'invoice')}
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)'
              }}
            >
              <Plus size={18} />
              Add New
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', background: '#0a0e27' }}>
          {activeView === 'dashboard' && <Dashboard customers={customers} jobs={jobs} invoices={invoices} />}
          {activeView === 'customers' && <Customers customers={customers} onEdit={openModal} onDelete={handleDelete} />}
          {activeView === 'jobs' && <Jobs jobs={jobs} customers={customers} technicians={technicians} onEdit={openModal} onDelete={handleDelete} />}
          {activeView === 'schedule' && <Schedule jobs={jobs} technicians={technicians} />}
          {activeView === 'invoices' && <Invoices invoices={invoices} customers={customers} onEdit={openModal} onDelete={handleDelete} />}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          item={selectedItem}
          customers={customers}
          technicians={technicians}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ customers, jobs, invoices }) => {
  const stats = [
    { 
      label: 'Total Customers', 
      value: customers.length, 
      icon: Users, 
      color: '#00d4ff',
      change: '+12%'
    },
    { 
      label: 'Active Jobs', 
      value: jobs.filter(j => j.status === 'in-progress' || j.status === 'scheduled').length, 
      icon: Briefcase, 
      color: '#00ff9d',
      change: '+8%'
    },
    { 
      label: 'Pending Invoices', 
      value: invoices.filter(i => i.status === 'sent' || i.status === 'draft').length, 
      icon: FileText, 
      color: '#ffc107',
      change: '-3%'
    },
    { 
      label: 'Monthly Revenue', 
      value: `$${invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: '#00ff9d',
      change: '+24%'
    },
  ];

  const upcomingJobs = jobs
    .filter(j => j.scheduledDate && new Date(j.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 5);

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 24, 46, 0.6), rgba(10, 14, 39, 0.8))',
              backdropFilter: 'blur(10px)',
              padding: '28px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              animationDelay: `${idx * 0.1}s`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${stat.color}40`
              }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <span style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: stat.change.startsWith('+') ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                color: stat.change.startsWith('+') ? '#00ff9d' : '#ffc107',
                border: `1px solid ${stat.change.startsWith('+') ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`,
                fontWeight: '600'
              }}>
                {stat.change}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Jobs */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 46, 0.6), rgba(10, 14, 39, 0.8))',
        backdropFilter: 'blur(10px)',
        padding: '32px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '4px' }}>Upcoming Jobs</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>Next scheduled services</p>
          </div>
          <Calendar size={24} style={{ color: '#00d4ff' }} />
        </div>
        
        {upcomingJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.5)' }}>
            <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No upcoming jobs scheduled</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingJobs.map(job => (
              <div
                key={job.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{job.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      {job.customerName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Customers Component
const Customers = ({ customers, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          position: 'relative',
          maxWidth: '400px'
        }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.4)'
          }} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
              e.target.style.borderColor = '#00d4ff';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
        gap: '24px'
      }}>
        {filteredCustomers.map((customer, idx) => (
          <div
            key={customer.id}
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(18, 24, 46, 0.6), rgba(10, 14, 39, 0.8))',
              backdropFilter: 'blur(10px)',
              padding: '28px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              animationDelay: `${idx * 0.05}s`,
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '700',
                boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)'
              }}>
                {customer.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onEdit('customer', customer)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#00d4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete('customer', customer.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#ff4757',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{customer.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <User size={16} style={{ color: '#00d4ff' }} />
                {customer.contactPerson}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <Mail size={16} style={{ color: '#00d4ff' }} />
                {customer.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <Phone size={16} style={{ color: '#00d4ff' }} />
                {customer.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <MapPin size={16} style={{ color: '#00d4ff' }} />
                {customer.address}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jobs</div>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>{customer.jobCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#00ff9d' }}>${customer.totalRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Jobs Component  
const Jobs = ({ jobs, customers, technicians, onEdit, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredJobs = filterStatus === 'all' 
    ? jobs 
    : jobs.filter(j => j.status === filterStatus);

  return (
    <div>
      {/* Filter */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        {['all', 'pending', 'scheduled', 'in-progress', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: filterStatus === status ? 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'capitalize'
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }
            }}
          >
            {status === 'all' ? 'All Jobs' : status.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 46, 0.6), rgba(10, 14, 39, 0.8))',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technician</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scheduled</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</th>
                <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, idx) => (
                <tr 
                  key={job.id}
                  style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{job.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>{job.description.substring(0, 50)}...</div>
                  </td>
                  <td style={{ padding: '20px 24px', fontSize: '14px' }}>{job.customerName}</td>
                  <td style={{ padding: '20px 24px', fontSize: '14px' }}>{job.assignedTechnicianName || 'Unassigned'}</td>
                  <td style={{ padding: '20px 24px', fontSize: '14px' }}>
                    {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <StatusBadge status={job.status} />
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <PriorityBadge priority={job.priority} />
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onEdit('job', job)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          color: '#00d4ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete('job', job.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          color: '#ff4757',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Schedule Component
const Schedule = ({ jobs, technicians }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get days in month view
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  const getJobsForDay = (day) => {
    if (!day) return [];
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return jobs.filter(j => j.scheduledDate && j.scheduledDate.startsWith(dateStr));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div>
      {/* Calendar Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '600' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 20px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 20px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 46, 0.6), rgba(10, 14, 39, 0.8))',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '28px'
      }}>
        {/* Week Day Headers */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '8px'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px'
        }}>
          {getDaysInMonth().map((day, idx) => {
            const dayJobs = getJobsForDay(day);
            const isToday = day && 
              day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={idx}
                style={{
                  minHeight: '120px',
                  padding: '12px',
                  background: day ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  borderRadius: '12px',
                  border: isToday ? '2px solid #00d4ff' : '1px solid rgba(255, 255, 255, 0.06)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (day) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (day) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {day && (
                  <>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: isToday ? '#00d4ff' : '#fff'
                    }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {dayJobs.slice(0, 2).map(job => (
                        <div
                          key={job.id}
                          style={{
                            padding: '6px 8px',
                            background: job.priority === 'high' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(0, 212, 255, 0.2)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            border: `1px solid ${job.priority === 'high' ? 'rgba(255, 71, 87, 0.4)' : 'rgba(0, 212, 255, 0.4)'}`
                          }}
                          title={job.title}
                        >
                          {job.title}
                        </div>
                      ))}
                      {dayJobs.length > 2 && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontWeight: '600',
                          marginTop: '4px'
                        }}>
                          +{dayJobs.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Invoices Component
const Invoices = ({ invoices, customers, onEdit, onDelete }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
      gap: '24px'
    }}>
      {invoices.map((invoice, idx) => (
        <div
          key={invoice.id}
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(18, 24, 46, 0.6), rgba(10, 14, 39, 0.8))',
            backdropFilter: 'blur(10px)',
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            animationDelay: `${idx * 0.05}s`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '600'
              }}>
                Invoice
              </div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                fontFamily: '"Space Mono", monospace',
                color: '#00d4ff'
              }}>
                {invoice.invoiceNumber}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onEdit('invoice', invoice)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#00d4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete('invoice', invoice.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#ff4757',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{invoice.customerName}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Issued: {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
              {invoice.dueDate && <div>Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>}
              {invoice.paidDate && <div>Paid: {new Date(invoice.paidDate).toLocaleDateString()}</div>}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Subtotal</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Tax</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              <span>Total</span>
              <span style={{ color: '#00ff9d' }}>${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          <StatusBadge status={invoice.status} />
        </div>
      ))}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'pending': { color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)', border: 'rgba(255, 193, 7, 0.3)', label: 'Pending' },
    'scheduled': { color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.3)', label: 'Scheduled' },
    'in-progress': { color: '#2196f3', bg: 'rgba(33, 150, 243, 0.1)', border: 'rgba(33, 150, 243, 0.3)', label: 'In Progress' },
    'completed': { color: '#00ff9d', bg: 'rgba(0, 255, 157, 0.1)', border: 'rgba(0, 255, 157, 0.3)', label: 'Completed' },
    'cancelled': { color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)', border: 'rgba(255, 71, 87, 0.3)', label: 'Cancelled' },
    'draft': { color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.1)', border: 'rgba(158, 158, 158, 0.3)', label: 'Draft' },
    'sent': { color: '#00d4ff', bg: 'rgba(0, 212, 255, 0.1)', border: 'rgba(0, 212, 255, 0.3)', label: 'Sent' },
    'paid': { color: '#00ff9d', bg: 'rgba(0, 255, 157, 0.1)', border: 'rgba(0, 255, 157, 0.3)', label: 'Paid' },
    'overdue': { color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)', border: 'rgba(255, 71, 87, 0.3)', label: 'Overdue' }
  };

  const config = statusConfig[status] || statusConfig['pending'];

  return (
    <span className="status-badge" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
      textTransform: 'capitalize'
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: config.color
      }} />
      {config.label}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    'low': { color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.1)', border: 'rgba(158, 158, 158, 0.3)' },
    'medium': { color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)', border: 'rgba(255, 193, 7, 0.3)' },
    'high': { color: '#ff9800', bg: 'rgba(255, 152, 0, 0.1)', border: 'rgba(255, 152, 0, 0.3)' },
    'urgent': { color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)', border: 'rgba(255, 71, 87, 0.3)' }
  };

  const config = priorityConfig[priority] || priorityConfig['medium'];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
      textTransform: 'capitalize'
    }}>
      {priority}
    </span>
  );
};

// Modal Component
const Modal = ({ type, item, customers, technicians, onSave, onClose }) => {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #12182e 0%, #0a0e27 100%)',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
        animation: 'slideIn 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
            {item ? 'Edit' : 'New'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {type === 'customer' && (
            <>
              <FormField label="Company Name" required>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Contact Person">
                <input
                  type="text"
                  value={formData.contactPerson || ''}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                />
              </FormField>
              <FormField label="Email" required>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Phone">
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </FormField>
              <FormField label="Address">
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </FormField>
            </>
          )}

          {type === 'job' && (
            <>
              <FormField label="Customer" required>
                <select
                  value={formData.customerId || ''}
                  onChange={(e) => handleChange('customerId', parseInt(e.target.value))}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Title" required>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="3"
                />
              </FormField>
              <FormField label="Technician">
                <select
                  value={formData.assignedTechnicianId || ''}
                  onChange={(e) => handleChange('assignedTechnicianId', e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Unassigned</option>
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>{t.name} - {t.specialization}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Scheduled Date">
                <input
                  type="datetime-local"
                  value={formData.scheduledDate ? formData.scheduledDate.slice(0, 16) : ''}
                  onChange={(e) => handleChange('scheduledDate', e.target.value)}
                />
              </FormField>
              <FormField label="Priority">
                <select
                  value={formData.priority || 'medium'}
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </FormField>
              {item && (
                <FormField label="Status">
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormField>
              )}
              <FormField label="Estimated Hours">
                <input
                  type="number"
                  step="0.5"
                  value={formData.estimatedHours || ''}
                  onChange={(e) => handleChange('estimatedHours', parseFloat(e.target.value))}
                />
              </FormField>
            </>
          )}

          {type === 'invoice' && item && (
            <>
              <FormField label="Status">
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>
              <FormField label="Due Date">
                <input
                  type="date"
                  value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </FormField>
              {formData.status === 'paid' && (
                <FormField label="Paid Date">
                  <input
                    type="date"
                    value={formData.paidDate ? formData.paidDate.split('T')[0] : ''}
                    onChange={(e) => handleChange('paidDate', e.target.value)}
                  />
                </FormField>
              )}
              <FormField label="Notes">
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows="3"
                />
              </FormField>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="submit"
              className="btn"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
                color: '#fff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} />
              Save {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px 24px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Form Field Component
const FormField = ({ label, required, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{
      fontSize: '13px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.8)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {label}{required && <span style={{ color: '#ff4757' }}> *</span>}
    </label>
    <div style={{
      '& input, & select, & textarea': {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit'
      }
    }}>
      {React.cloneElement(children, {
        style: {
          width: '100%',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '14px',
          outline: 'none',
          transition: 'all 0.3s ease',
          fontFamily: 'inherit'
        },
        onFocus: (e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.08)';
          e.target.style.borderColor = '#00d4ff';
        },
        onBlur: (e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      })}
    </div>
  </div>
);

export default App;
