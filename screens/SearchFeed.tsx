
import React from 'react';
import { Job, Profile, Application } from '../types';

interface SearchFeedProps {
  currentUser: Profile | null;
  jobs: Job[];
  applications: Application[];
  onApply: (jobId: string, reqId: string) => void;
}

const SearchFeed: React.FC<SearchFeedProps> = ({ currentUser, jobs, applications, onApply }) => {
  const isCandidate = currentUser?.user_type === 'Candidate';

  const openMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  const hasApplied = (reqId: string) => {
    return applications.some(app => app.job_req_id === reqId && app.candidate_id === currentUser?.id);
  };

  return (
    <div className="p-4 space-y-6 pb-10">
      <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
        <div className="flex items-center space-x-3 bg-gray-100 rounded-xl p-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search location or job type..." className="bg-transparent border-none focus:ring-0 w-full text-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md">
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold leading-tight text-[#054752]">{job.title}</h3>
                  <button onClick={() => openMaps(job.location_text)} className="text-[#00AFF5] text-sm font-medium hover:underline flex items-center mt-1">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {job.location_text}
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold">{new Date(job.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>

              <div className="space-y-3">
                {job.requirements.map(req => {
                  const alreadyApplied = hasApplied(req.id);
                  return (
                    <div key={req.id} className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <div>
                        <span className="text-xs font-bold text-[#00AFF5] uppercase tracking-wider">{req.profile_type}</span>
                        <p className="text-xs text-gray-500">{req.count_needed - req.count_filled} left</p>
                      </div>
                      <div className="text-right">
                        <p className="text-md font-bold text-[#054752]">₹{req.budget_per_person}</p>
                        {isCandidate && (
                          alreadyApplied ? (
                            <button 
                              disabled
                              className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold mt-1 cursor-default flex items-center space-x-1"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              <span>Applied</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => onApply(job.id, req.id)}
                              className="bg-[#00AFF5] text-white px-4 py-1.5 rounded-full text-xs font-bold mt-1 active:scale-95 transition-transform hover:bg-[#0096d1]"
                            >
                              Apply
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFeed;
