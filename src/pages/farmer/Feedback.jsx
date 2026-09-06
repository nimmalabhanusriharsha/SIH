import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { MessageSquareWarning, Star, Send, ThumbsUp, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const { state, setState, currentUser } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback', 'complaint'
  
  // Feedback state
  const [rating, setRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  
  // Complaint state
  const [complaintType, setComplaintType] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedbackCategory('');
      setFeedbackText('');
    }, 3000);
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    
    const newComplaint = {
      id: `CMP-${Date.now()}`,
      farmerId: currentUser.id,
      type: complaintType,
      description: complaintDesc,
      status: 'Open',
      date: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      complaints: [newComplaint, ...(prev.complaints || [])]
    }));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComplaintType('');
      setComplaintDesc('');
      setActiveTab('history');
    }, 2000);
  };

  const myComplaints = (state.complaints || []).filter(c => c.farmerId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Feedback & Support</h2>
        <p className="text-earth-600 mt-1">Help us improve or report an issue you faced at the centre.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-earth-200 pb-px">
        <button 
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'feedback' ? 'border-forest-600 text-forest-900' : 'border-transparent text-earth-500 hover:text-earth-800'}`}
          onClick={() => setActiveTab('feedback')}
        >
          Rate Experience
        </button>
        <button 
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'complaint' ? 'border-forest-600 text-forest-900' : 'border-transparent text-earth-500 hover:text-earth-800'}`}
          onClick={() => setActiveTab('complaint')}
        >
          File Complaint
        </button>
        <button 
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'history' ? 'border-forest-600 text-forest-900' : 'border-transparent text-earth-500 hover:text-earth-800'}`}
          onClick={() => setActiveTab('history')}
        >
          Complaint History {myComplaints.length > 0 && <span className="ml-1 bg-earth-200 text-earth-700 px-1.5 py-0.5 rounded-full text-[10px]">{myComplaints.length}</span>}
        </button>
      </div>

      {activeTab === 'feedback' && (
        <Card className="border-earth-200 shadow-sm max-w-2xl">
          <CardHeader className="bg-earth-50 border-b border-earth-100 py-4">
             <CardTitle className="text-lg font-bold text-forest-900 flex items-center gap-2">
               <Star className="w-5 h-5 text-forest-600" /> Share Your Experience
             </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                   <ThumbsUp className="w-8 h-8 text-green-600" />
                 </div>
                 <h3 className="text-xl font-bold text-forest-900">Thank You!</h3>
                 <p className="text-earth-600 mt-2">Your feedback helps us improve KisanQueue.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                
                <div>
                  <label className="text-sm font-bold text-earth-700 block mb-3">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} type="button"
                        onClick={() => setRating(star)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${rating >= star ? 'bg-amber-100 text-amber-500 scale-110' : 'bg-earth-100 text-earth-400 hover:bg-earth-200'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-earth-700 block mb-3">What did you like most?</label>
                  <div className="flex flex-wrap gap-2">
                    {['Quick Processing', 'Staff Behavior', 'Facility Quality', 'Smart Queue System', 'Payment Speed'].map(cat => (
                      <button 
                        key={cat} type="button"
                        onClick={() => setFeedbackCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${feedbackCategory === cat ? 'bg-forest-900 border-forest-900 text-white' : 'bg-white border-earth-300 text-earth-600 hover:border-forest-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-earth-700 block mb-2">Additional Comments</label>
                  <textarea 
                    className="w-full h-32 rounded-xl border border-earth-300 p-4 font-medium text-earth-900 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 resize-none"
                    placeholder="Tell us more about your experience..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  ></textarea>
                </div>

                <Button type="submit" className="w-full font-bold bg-forest-600 hover:bg-forest-700" disabled={rating === 0}>
                   Submit Feedback <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'complaint' && (
        <Card className="border-red-100 shadow-sm max-w-2xl bg-gradient-to-b from-white to-red-50/30">
          <CardHeader className="bg-red-50 border-b border-red-100 py-4">
             <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
               <MessageSquareWarning className="w-5 h-5 text-red-600" /> File a Complaint
             </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmitComplaint} className="space-y-5">
               <div>
                  <label className="text-sm font-bold text-earth-700 block mb-2">Issue Type</label>
                  <select 
                    className="w-full h-12 rounded-xl border border-earth-300 bg-white px-4 font-medium text-earth-900"
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                    required
                  >
                    <option value="">Select an issue...</option>
                    <option value="Weighing Discrepancy">Weighing Discrepancy</option>
                    <option value="Payment Delay">Payment Delay</option>
                    <option value="Queue Management Issue">Queue Management Issue</option>
                    <option value="Staff Behavior">Staff Behavior</option>
                    <option value="Quality Assessment Dispute">Quality Assessment Dispute</option>
                    <option value="Other">Other</option>
                  </select>
               </div>

               <div>
                  <label className="text-sm font-bold text-earth-700 block mb-2">Description</label>
                  <textarea 
                    className="w-full h-32 rounded-xl border border-earth-300 p-4 font-medium text-earth-900 resize-none"
                    placeholder="Please provide details about the issue..."
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    required
                  ></textarea>
               </div>

               <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs font-medium text-blue-800">Your complaint will be assigned a unique ID and forwarded to the Mandal Agricultural Officer (MAO) for review.</p>
               </div>

               <Button type="submit" className="w-full font-bold bg-red-600 hover:bg-red-700 text-white shadow-md">
                 Submit Complaint
               </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card className="border-earth-200 shadow-sm max-w-4xl">
          <CardContent className="p-0">
             {myComplaints.length > 0 ? (
               <div className="divide-y divide-earth-100">
                  {myComplaints.map(c => (
                    <div key={c.id} className="p-6 flex flex-col md:flex-row gap-4 justify-between md:items-center hover:bg-earth-50 transition-colors">
                       <div>
                         <div className="flex items-center gap-3 mb-1">
                           <h4 className="font-bold text-forest-900 text-lg">{c.type}</h4>
                           <Badge variant={c.status === 'Open' ? 'warning' : 'success'} className="uppercase font-bold text-[10px]">{c.status}</Badge>
                         </div>
                         <p className="text-earth-600 text-sm mt-2">{c.description}</p>
                         <div className="flex items-center gap-4 mt-3">
                           <span className="text-xs font-bold text-earth-500 uppercase tracking-wider">{c.id}</span>
                           <span className="text-xs font-bold text-earth-400">{new Date(c.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</span>
                         </div>
                       </div>
                       <Button variant="outline" className="font-bold border-earth-300 text-earth-700 w-full md:w-auto">View Updates</Button>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mb-4">
                   <MessageSquareWarning className="w-8 h-8 text-earth-400" />
                 </div>
                 <h3 className="text-lg font-bold text-earth-900">No Complaints Found</h3>
                 <p className="text-earth-500 mt-1">You haven't filed any complaints yet.</p>
               </div>
             )}
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Feedback;
