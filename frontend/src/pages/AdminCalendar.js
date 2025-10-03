import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [daySchedule, setDaySchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  useEffect(() => {
    fetchCalendarEvents();
    fetchStats();
  }, [currentDate, viewMode]);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      let startDate, endDate;
      
      if (viewMode === 'day') {
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
      } else if (viewMode === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        startDate = startOfWeek;
        endDate = endOfWeek;
      } else {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      }
      
      const response = await api.get('/admin/calendar/events', {
        params: {
          start: startDate.getFullYear() + '-' + 
                 String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(startDate.getDate()).padStart(2, '0'),
          end: endDate.getFullYear() + '-' + 
               String(endDate.getMonth() + 1).padStart(2, '0') + '-' + 
               String(endDate.getDate()).padStart(2, '0')
        }
      });
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaySchedule = async (date) => {
    try {
      const response = await api.get(`/admin/calendar/day/${date}`);
      setDaySchedule(response.data.schedule);
    } catch (error) {
      console.error('Error fetching day schedule:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/calendar/stats?period=monthly');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getHourSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getEventsForDateTime = (date, hour = null) => {
    if (!date) return [];
    // Use local date string to avoid timezone conversion issues
    const dateStr = date.getFullYear() + '-' + 
                   String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(date.getDate()).padStart(2, '0');
    
    return events.filter(event => {
      // Extract date from event start - be very careful about timezone
      const eventDate = new Date(event.start);
      const eventDateStr = eventDate.getFullYear() + '-' + 
                          String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(eventDate.getDate()).padStart(2, '0');
      
      if (eventDateStr !== dateStr) return false;
      
      if (hour !== null) {
        // Parse the backend time correctly - backend now sends UTC times
        const eventTime = new Date(event.start);
        // Get the hour from the event's local time (browser will convert from UTC automatically)
        const eventHour = eventTime.getHours();
        return eventHour === hour;
      }
      
      return true;
    });
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    // Use local date formatting to avoid timezone conversion issues
    const dateStr = date.getFullYear() + '-' + 
                   String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(date.getDate()).padStart(2, '0');
    
    return events.filter(event => {
      // Extract date from event start without timezone conversion
      const eventDate = new Date(event.start);
      const eventDateStr = eventDate.getFullYear() + '-' + 
                          String(eventDate.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(eventDate.getDate()).padStart(2, '0');
      return eventDateStr === dateStr;
    });
  };

  const handleDateClick = (date) => {
    if (!date) return;
    // Use local date formatting to avoid timezone conversion issues
    const dateStr = date.getFullYear() + '-' + 
                   String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(date.getDate()).padStart(2, '0');
    setSelectedDate(dateStr);
    fetchDaySchedule(dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-200 text-orange-800';
      case 'confirmed': return 'bg-green-200 text-green-800';
      case 'in_progress': return 'bg-blue-200 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-900';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const navigateTime = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'day') {
        newDate.setDate(prev.getDate() + direction);
      } else if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction * 7));
      } else {
        newDate.setMonth(prev.getMonth() + direction);
      }
      return newDate;
    });
  };

  const getViewTitle = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays();
      const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${start} - ${end}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const formatTime = (timeStr) => {
    // Handle both HH:mm and H:mm formats
    if (!timeStr) return 'Invalid time';
    
    // If timeStr is already in HH:mm format, use it directly
    // If it's in H:mm format (like "7:00"), pad with zero
    let formattedTimeStr = timeStr;
    if (timeStr.length === 4 && timeStr.indexOf(':') === 1) {
      formattedTimeStr = '0' + timeStr; // Convert "7:00" to "07:00"
    }
    
    try {
      const time = new Date(`2000-01-01T${formattedTimeStr}:00`);
      if (isNaN(time.getTime())) {
        // If still invalid, try parsing as just the hour
        const hour = parseInt(timeStr.split(':')[0]);
        if (!isNaN(hour)) {
          const time = new Date();
          time.setHours(hour, 0, 0, 0);
          return time.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
        }
        return 'Invalid time';
      }
      
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', timeStr, error);
      return 'Invalid time';
    }
  };

  const days = viewMode === 'month' ? getDaysInMonth() : getWeekDays();
  const hours = getHourSlots();

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {days.map((date, index) => {
        const dayEvents = getEventsForDate(date);
        // Use local date formatting to match handleDateClick
        const dateStr = date ? date.getFullYear() + '-' + 
                              String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                              String(date.getDate()).padStart(2, '0') : null;
        const isSelected = dateStr && selectedDate === dateStr;
        const isToday = date && date.toDateString() === new Date().toDateString();
        
        return (
          <div
            key={index}
            className={`
              min-h-[120px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50
              ${isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''}
              ${isToday ? 'bg-blue-100' : ''}
              ${!date ? 'bg-gray-50' : ''}
            `}
            onClick={() => handleDateClick(date)}
          >
            {date && (
              <>
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </div>
                {dayEvents.length > 0 && (
                  <div className="text-xs text-gray-500 mb-1">
                    {dayEvents.length} booking{dayEvents.length !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => {
                    // Extract time from the event start, but parse it carefully to avoid timezone issues
                    // The backend sends "2025-10-03T13:00:00Z" where 13:00 is the actual local time
                    const eventStartStr = event.start; // "2025-10-03T13:00:00Z"
                    const timePart = eventStartStr.split('T')[1].split('Z')[0]; // "13:00:00"
                    const [hours, minutes] = timePart.split(':');
                    
                    // Create a local time without timezone conversion
                    const localTime = new Date();
                    localTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                    
                    const timeStr = localTime.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true
                    });
                    
                    return (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded truncate ${getStatusColor(event.status)}`}
                        title={`${event.title} - ${timeStr}`}
                      >
                        <div className="font-medium">{timeStr}</div>
                        <div className="truncate">{event.service_name}</div>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center mt-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => (
    <div className="grid grid-cols-8 gap-1">
      {/* Time column */}
      <div className="col-span-1">
        <div className="h-12 border-b border-gray-200"></div>
        {hours.map(hour => (
          <div key={hour} className="h-16 border-b border-gray-200 text-xs text-gray-500 p-1">
            {formatTime(`${hour.toString().padStart(2, '0')}:00`)}
          </div>
        ))}
      </div>
      
      {/* Day columns */}
      {days.map((date, dayIndex) => (
        <div key={dayIndex} className="col-span-1">
          {/* Day header */}
          <div className={`h-12 border-b border-gray-200 p-2 text-center ${
            date.toDateString() === new Date().toDateString() ? 'bg-blue-100 text-blue-600 font-semibold' : ''
          }`}>
            <div className="text-xs text-gray-500">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-sm font-medium">
              {date.getDate()}
            </div>
          </div>
          
          {/* Hour slots */}
          {hours.map(hour => {
            const hourEvents = getEventsForDateTime(date, hour);
            return (
              <div key={hour} className="h-16 border-b border-gray-200 border-r border-gray-200 p-1 relative">
                {hourEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-xs p-1 rounded truncate mb-1 ${getStatusColor(event.status)}`}
                    title={`${event.title} - ${(() => {
                      const timePart = event.start.split('T')[1].split('Z')[0];
                      const [hours, minutes] = timePart.split(':');
                      const localTime = new Date();
                      localTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      return localTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true
                      });
                    })()}`}
                  >
                    {event.service_name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderDayView = () => {
    const dayEvents = getEventsForDateTime(currentDate).sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    return (
      <div className="grid grid-cols-2 gap-6">
        {/* Time slots */}
        <div>
          <h3 className="text-lg font-medium mb-4">Schedule</h3>
          <div className="space-y-2">
            {hours.map(hour => {
              const hourEvents = getEventsForDateTime(currentDate, hour);
              return (
                <div key={hour} className="flex border-b border-gray-200 pb-2">
                  <div className="w-20 text-sm text-gray-500 pt-1">
                    {formatTime(`${hour.toString().padStart(2, '0')}:00`)}
                  </div>
                  <div className="flex-1">
                    {hourEvents.length > 0 ? (
                      hourEvents.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`p-2 rounded mb-1 ${getStatusColor(event.status)}`}
                        >
                          <div className="font-medium text-sm">{event.service_name}</div>
                          <div className="text-xs">{event.customer_name}</div>
                          <div className="text-xs">{event.address}</div>
                          <div className="text-xs font-medium">${event.total_price}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-300 text-sm py-2">Available</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day summary */}
        <div>
          <h3 className="text-lg font-medium mb-4">Day Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{dayEvents.length}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${dayEvents.reduce((sum, event) => sum + event.total_price, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Upcoming Appointments</h4>
              {dayEvents.slice(0, 5).map((event, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">
                    {(() => {
                      const timePart = event.start.split('T')[1].split('Z')[0];
                      const [hours, minutes] = timePart.split(':');
                      const localTime = new Date();
                      localTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      return localTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      });
                    })()}
                  </span>
                  <span className="ml-2 text-gray-600">{event.service_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Calendar</h1>
              {stats && (
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>Total Bookings: {stats.data.total_bookings}</span>
                  <span>Revenue: ${stats.data.total_revenue.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Calendar Header with View Mode Selector */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateTime(-1)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-900">{getViewTitle()}</h2>
                <button
                  onClick={() => navigateTime(1)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* View Mode Selector */}
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    viewMode === 'month' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    viewMode === 'week' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    viewMode === 'day' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Day
                </button>
              </div>
            </div>

            {viewMode === 'month' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  {renderMonthView()}
                </div>

                {/* Day Schedule Panel for Month View */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedDate ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Schedule for {(() => {
                            // Parse date carefully to avoid timezone issues
                            const [year, month, day] = selectedDate.split('-');
                            const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            return dateObj.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            });
                          })()}
                        </h3>
                        
                        {daySchedule ? (
                          <>
                            {daySchedule.stats && (
                              <div className="mb-4 p-3 bg-white rounded border">
                                <div className="text-sm text-gray-600">
                                  <div>Bookings: {daySchedule.stats.total_bookings}</div>
                                  <div>Revenue: ${daySchedule.stats.revenue.toFixed(2)}</div>
                                  {daySchedule.stats.avg_duration > 0 && (
                                    <div>Avg Duration: {daySchedule.stats.avg_duration.toFixed(1)}h</div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-3">
                              {daySchedule.bookings && daySchedule.bookings.length > 0 ? (
                                daySchedule.bookings.map((booking, index) => (
                                  <div key={index} className="bg-white p-3 rounded border">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">
                                        {(() => {
                                          const timePart = booking.start.split('T')[1].split('Z')[0];
                                          const [hours, minutes] = timePart.split(':');
                                          const localTime = new Date();
                                          localTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                                          return localTime.toLocaleTimeString('en-US', { 
                                            hour: 'numeric', 
                                            minute: '2-digit',
                                            hour12: true 
                                          });
                                        })()}
                                      </span>
                                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-900">
                                      {booking.service_name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {booking.customer_name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {booking.address}
                                    </div>
                                    <div className="text-sm font-medium text-green-600">
                                      ${booking.total_price}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-500 text-center py-4">
                                  No bookings for this day
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">Loading...</div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-500 text-center py-8">
                        Select a date to view schedule
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'week' && (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {renderWeekView()}
                </div>
              </div>
            )}

            {viewMode === 'day' && renderDayView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;