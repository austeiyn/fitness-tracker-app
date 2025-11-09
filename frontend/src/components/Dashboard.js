import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Trash2, Activity } from 'lucide-react';
import { getActivities, createActivity, deleteActivity, logout } from '../services/api';
import { styles } from '../styles/styles';

function Dashboard({ onLogout }) {
    const [activities, setActivities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        activity_type: 'workout',
        title: '',
        description: '',
        duration: '',
        steps: null,
        status: 'planned'
    });

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (err) {
            console.error('Error loading activities', err);
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Prepare data - convert empty strings to null for numeric fields
        const dataToSend = {
            ...formData,
            duration: formData.duration ? parseInt(formData.duration) : null,
            steps: formData.steps ? parseInt(formData.steps) : null
        };

        console.log('Sending data:', dataToSend);
        await createActivity(dataToSend);
        setShowForm(false);
        setFormData({
            activity_type: 'workout',
            title: '',
            description: '',
            duration: '',
            steps: null,  // Change from '' to null
            status: 'planned'
        });
        loadActivities();
    } catch (err) {
        console.error('Error creating activity', err);
        console.error('Error response:', err.response?.data);
        alert('Error creating activity: ' + JSON.stringify(err.response?.data));
    }
};

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await deleteActivity(id);
                loadActivities();
            } catch (err) {
                console.error('Error deleting activity', err);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            onLogout();
        } catch (err) {
            console.error('Error logging out', err);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return { backgroundColor: '#10b981', color: 'white' };
            case 'in_progress': return { backgroundColor: '#f59e0b', color: 'white' };
            default: return { backgroundColor: '#6b7280', color: 'white' };
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ color: 'white', fontSize: '36px', margin: '0 0 8px 0' }}>Fitness Dashboard</h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>Track your fitness journey</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{...styles.button, ...styles.dangerButton}}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#dc2626';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#ef4444';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <LogOut size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        Logout
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{...styles.button, ...styles.successButton}}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#059669';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#10b981';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        {showForm ? 'Cancel' : 'Add New Activity'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} style={styles.formCard}>
                        <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#1f2937' }}>Add New Activity</h2>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Activity Type:</label>
                            <select
                                value={formData.activity_type}
                                onChange={(e) => setFormData({...formData, activity_type: e.target.value})}
                                style={styles.select}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="workout">Workout</option>
                                <option value="meal">Meal</option>
                                <option value="steps">Steps</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Title:</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description:</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                style={styles.textarea}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                rows="3"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Duration (minutes):</label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                style={styles.input}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Status:</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                style={styles.select}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="planned">Planned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            style={{...styles.button, ...styles.primaryButton, width: '100%'}}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            Save Activity
                        </button>
                    </form>
                )}

                <div>
                    <h2 style={{ color: 'white', textAlign: 'center', fontSize: '28px', marginBottom: '24px' }}>My Activities</h2>
                    {activities.length === 0 ? (
                        <div style={styles.card}>
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <Activity size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                                <p style={{ color: '#6b7280', fontSize: '18px', margin: 0 }}>No activities yet.</p>
                                <p style={{ color: '#9ca3af', marginTop: '8px' }}>Add your first activity above!</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                            {activities.map(activity => (
                                <div
                                    key={activity.id}
                                    style={styles.activityCard}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{ marginBottom: '16px' }}>
                                        <h3 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '20px' }}>{activity.title}</h3>
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ ...styles.statusBadge, backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                                                {activity.activity_type}
                                            </span>
                                            <span style={{ ...styles.statusBadge, ...getStatusColor(activity.status) }}>
                                                {activity.status}
                                            </span>
                                        </div>
                                        {activity.description && (
                                            <p style={{ color: '#6b7280', margin: '12px 0', lineHeight: '1.5' }}>{activity.description}</p>
                                        )}
                                        {activity.duration && (
                                            <p style={{ color: '#374151', margin: '8px 0' }}>
                                                <strong>Duration:</strong> {activity.duration} minutes
                                            </p>
                                        )}
                                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '8px 0 0 0' }}>
                                            {new Date(activity.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(activity.id)}
                                        style={{...styles.button, ...styles.dangerButton, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#dc2626';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#ef4444';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;