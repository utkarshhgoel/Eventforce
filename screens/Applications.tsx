
import React, { useState } from 'react';
import { UserType, Profile, Job, Application, ApplicationStatus, JobStatus, Review } from '../types';
import ProfileScreen from './Profile';

interface ApplicationsScreenProps {
  currentUser: Profile | null;
  jobs: Job[];
  applications: Application[];
  candidateProfiles: Profile[];
  reviews: Review[];
  onUpdateJobStatus: (jobId: string, status: JobStatus) => void;
  onSubmitReview: (review: Omit<Review, 'id' | 'created_at'>) => void;
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
}

const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ 
  currentUser, jobs, applications, candidateProfiles, reviews, onUpdateJobStatus, onSubmitReview, onUpdateApplicationStatus
}) => {
  const isOrganizer = currentUser?.user_type === UserType.ORGANIZER;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);
  const [reviewingCandidate, setReviewingCandidate] = useState<Profile | null>(null);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Filter jobs for organizer
  const myJobs = jobs.filter(j => j.organizer_id === currentUser?.id);
  
  // Filter applications for candidate
  const myApps = applications.filter(a => a.candidate_id === currentUser?.id);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const handleReviewSubmit = () => {
    if (!reviewingCandidate || !selectedJobId || !currentUser) return;
    onSubmitReview({
      job_id: selectedJobId,
      reviewer_id: currentUser.id,
      reviewee_id: reviewingCandidate.id,
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewingCandidate(null);
    setReviewComment('');
    setReviewRating(5);
  };

  const handleStatusUpdate = (appId: string, status: ApplicationStatus) => {
    onUpdateApplicationStatus(appId, status);
    // Close profile view if active
    setViewingProfile(null);
    setViewingAppId(null);
  };

  // Review Candidate Modal
  if (reviewingCandidate) {
    return (
      <div className="fixed inset-0 bg-white z-[70] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center">
          <button onClick={() => setReviewingCandidate(null)} className="p-2 -ml-2 text-gray-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h2 className="ml-2 text-xl font-bold text-[#054752]">Review Candidate</h2>
        </div>
        <div className="p-8 space-y-8 max-w-lg mx-auto">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={reviewingCandidate.profile_pics[0]} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#054752]">{reviewingCandidate.full_name}</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Rate Performance</p>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => setReviewRating(star)}
                className={`p-2 transition-transform active:scale-90 ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
              >
                <svg className="h-10 w-10 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Feedback Comment</span>
              <textarea 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was their punctuality, dress code, and work ethic?"
                className="mt-2 w-full p-5 rounded-[24px] border-none bg-gray-50 text-[#054752] font-medium h-32 focus:ring-[#00AFF5]"
              ></textarea>
            </label>
            <button 
              onClick={handleReviewSubmit}
              className="w-full py-5 bg-[#00AFF5] text-white font-extrabold rounded-[24px] shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Candidate Profile Modal Overlay
  if (viewingProfile) {
    const currentApp = applications.find(a => a.id === viewingAppId);
    return (
      <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <button onClick={() => { setViewingProfile(null); setViewingAppId(null); }} className="flex items-center text-[#00AFF5] font-bold">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          {(isOrganizer && viewingAppId && currentApp?.status === ApplicationStatus.PENDING) && (
            <div className="flex space-x-2">
               <button 
                 onClick={() => handleStatusUpdate(viewingAppId, ApplicationStatus.REJECTED)}
                 className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm"
               >
                 Reject
               </button>
               <button 
                 onClick={() => handleStatusUpdate(viewingAppId, ApplicationStatus.ACCEPTED)}
                 className="px-4 py-2 bg-[#00AFF5] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
               >
                 Accept
               </button>
            </div>
          )}
        </div>
        <ProfileScreen currentUser={viewingProfile} />
      </div>
    );
  }

  // Individual Job Management View
  if (isOrganizer && selectedJobId) {
    const job = myJobs.find(j => j.id === selectedJobId);
    const jobApps = applications.filter(a => job?.requirements.some(r => r.id === a.job_req_id));
    const isCompleted = job?.status === JobStatus.COMPLETED;

    return (
      <div className="p-6 space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
          <button onClick={() => setSelectedJobId(null)} className="flex items-center text-[#00AFF5] font-bold">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          {!isCompleted && (
            <button 
              onClick={() => onUpdateJobStatus(job!.id, JobStatus.COMPLETED)}
              className="text-xs font-bold text-red-500 uppercase tracking-widest border border-red-100 px-4 py-2 rounded-full hover:bg-red-50"
            >
              End Job
            </button>
          )}
        </div>

        <div className={`p-6 rounded-[32px] border shadow-sm ${isCompleted ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-extrabold text-[#054752]">{job?.title}</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'bg-gray-200 text-gray-500' : 'bg-green-50 text-green-600'}`}>
              {job?.status}
            </span>
          </div>
          <p className="text-gray-500 font-medium mt-1">{jobApps.length} candidates involved</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {isCompleted ? 'Post-Job Reviews' : 'Candidate Management'}
          </h3>
          {jobApps.length > 0 ? jobApps.map(app => {
            const candidate = candidateProfiles.find(p => p.id === app.candidate_id);
            const isAccepted = app.status === ApplicationStatus.ACCEPTED;
            const isRejected = app.status === ApplicationStatus.REJECTED;
            const isPending = app.status === ApplicationStatus.PENDING;
            const hasReview = reviews.some(r => r.job_id === job?.id && r.reviewee_id === candidate?.id);

            // If job is completed, only show accepted candidates for review
            if (isCompleted && !isAccepted) return null;

            return (
              <div 
                key={app.id} 
                className={`p-4 rounded-[32px] border shadow-sm flex flex-col space-y-4 transition-all ${hasReview ? 'bg-blue-50/20 border-blue-100' : 'bg-white'}`}
              >
                <div 
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => {
                    if (candidate) {
                      setViewingProfile(candidate);
                      setViewingAppId(app.id);
                    }
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-50 bg-gray-100">
                    {candidate?.profile_pics[0] && <img src={candidate.profile_pics[0]} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-lg text-[#054752] leading-tight">{candidate?.full_name}</h4>
                      <span className="flex items-center text-xs font-bold text-yellow-500">⭐ {candidate?.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tighter">
                      {isAccepted ? 'Accepted Worker' : isRejected ? 'Rejected' : 'Applicant'}
                    </p>
                  </div>
                </div>

                {!isCompleted ? (
                  <div className="flex space-x-2 pt-2 border-t border-gray-50">
                    {isPending ? (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, ApplicationStatus.REJECTED)}
                          className="flex-1 py-3 text-red-400 bg-red-50/50 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors hover:bg-red-50"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(app.id, ApplicationStatus.ACCEPTED)}
                          className="flex-[2] py-3 text-white bg-[#00AFF5] rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-[0.98]"
                        >
                          Accept
                        </button>
                      </>
                    ) : (
                      <div className={`w-full py-3 rounded-2xl text-center text-xs font-bold uppercase tracking-widest ${isAccepted ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
                        {app.status}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-gray-50">
                    {hasReview ? (
                      <div className="py-2 px-4 rounded-2xl bg-white border border-blue-50">
                         <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Review Submitted</p>
                         <p className="text-xs font-medium text-gray-500 italic mt-1">"{reviews.find(r => r.job_id === job?.id && r.reviewee_id === candidate?.id)?.comment}"</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => candidate && setReviewingCandidate(candidate)}
                        className="w-full py-3 text-[#00AFF5] border-2 border-[#00AFF5] border-dashed rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-50 transition-colors"
                      >
                        Review Performance
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="p-16 text-center text-gray-400 font-bold border-2 border-dashed rounded-[40px] border-gray-100">
              <p className="uppercase tracking-widest text-xs">Waiting for data...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-[#054752]">{isOrganizer ? 'My Postings' : 'Applications'}</h2>
          <p className="text-sm font-medium text-gray-400 mt-1">
            {isOrganizer ? `${myJobs.length} event listings` : `Tracking ${myApps.length} applications`}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {isOrganizer ? (
          myJobs.length > 0 ? myJobs.map(job => (
            <div 
              key={job.id} 
              onClick={() => setSelectedJobId(job.id)} 
              className={`p-6 rounded-[32px] border shadow-sm flex justify-between items-center cursor-pointer transition-transform hover:shadow-md border-l-8 ${job.status === JobStatus.COMPLETED ? 'border-l-gray-300' : 'border-l-[#00AFF5]'}`}
            >
              <div>
                <h3 className={`font-extrabold text-xl ${job.status === JobStatus.COMPLETED ? 'text-gray-400' : 'text-[#054752]'}`}>{job.title}</h3>
                <div className="flex items-center space-x-3 mt-1">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(job.date).toLocaleDateString()}</p>
                   <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                   <p className="text-xs font-bold text-[#00AFF5]">
                     {job.status === JobStatus.COMPLETED ? 'Completed' : `${applications.filter(a => job.requirements.some(r => r.id === a.job_req_id)).length} Applicants`}
                   </p>
                </div>
              </div>
              <svg className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
            </div>
          )) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No jobs published</p>
            </div>
          )
        ) : (
          myApps.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-[32px] border shadow-sm flex justify-between items-center border-l-4 border-l-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-[#054752]">{app.job_title}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">Status: {app.status}</p>
              </div>
              <div className={`px-5 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${getStatusColor(app.status)}`}>
                {app.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsScreen;
