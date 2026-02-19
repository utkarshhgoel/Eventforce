
import React, { useState, useEffect } from 'react';
import { UserType, Profile, Job, Application, JobStatus, ApplicationStatus, Review } from './types';
import SearchFeed from './screens/SearchFeed';
import PublishForm from './screens/PublishForm';
import ApplicationsScreen from './screens/Applications';
import InboxScreen from './screens/Inbox';
import ProfileScreen from './screens/Profile';

// Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PublishIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'publish' | 'apps' | 'inbox' | 'profile'>('search');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidateProfiles, setCandidateProfiles] = useState<Profile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Dummy Data Setup
    const dummyUser: Profile = {
      id: 'user-org-123',
      user_type: UserType.ORGANIZER,
      full_name: 'Vikram Mehta',
      bio: 'Lead coordinator for Mehta Event Services. 10+ years experience in corporate hospitality.',
      location: 'South Delhi, Delhi',
      experience_years: 12,
      profile_pics: ['https://picsum.photos/200/200?random=10'],
      rating: 4.9
    };
    
    const dummyCandidates: Profile[] = [
      {
        id: 'cand-1',
        user_type: UserType.CANDIDATE,
        full_name: 'Rahul Sharma',
        bio: 'Energetic and punctual. I have worked as a runner for 5 big weddings.',
        location: 'Noida, UP',
        experience_years: 2,
        profile_pics: ['https://i.pravatar.cc/150?u=rahul'],
        rating: 4.7
      },
      {
        id: 'cand-2',
        user_type: UserType.CANDIDATE,
        full_name: 'Priya Verma',
        bio: 'Experienced hostess with a background in hotel management.',
        location: 'Gurgaon, Haryana',
        experience_years: 4,
        profile_pics: ['https://i.pravatar.cc/150?u=priya'],
        rating: 4.9
      }
    ];

    setCurrentUser(dummyUser);
    setCandidateProfiles(dummyCandidates);

    const initialJobs: Job[] = [
      {
        id: 'job-1',
        organizer_id: 'user-org-123',
        title: 'Lakeside Wedding Ceremony',
        location_text: 'Pari Chowk, Greater Noida',
        date: '2024-05-20',
        start_time: '14:00',
        end_time: '22:00',
        dress_code_male: 'Black Suit',
        dress_code_female: 'Saree',
        facilities: { food: true, travel: true, stay: false },
        status: JobStatus.OPEN,
        requirements: [
          {
            id: 'req-1',
            job_id: 'job-1',
            profile_type: 'Runner',
            count_needed: 4,
            count_filled: 2,
            budget_per_person: 1500,
            description: 'Help with backstage logistics.'
          }
        ]
      }
    ];
    setJobs(initialJobs);

    const initialApps: Application[] = [
      {
        id: 'app-init-1',
        job_req_id: 'req-1',
        candidate_id: 'cand-1',
        status: ApplicationStatus.ACCEPTED,
        job_title: 'Lakeside Wedding Ceremony'
      },
      {
        id: 'app-init-2',
        job_req_id: 'req-1',
        candidate_id: 'cand-2',
        status: ApplicationStatus.PENDING,
        job_title: 'Lakeside Wedding Ceremony'
      }
    ];
    setApplications(initialApps);
  }, []);

  const handlePublish = (newJob: any) => {
    const job: Job = {
      ...newJob,
      id: `job-${Date.now()}`,
      organizer_id: currentUser?.id || 'unknown',
      status: JobStatus.OPEN,
      requirements: newJob.requirements.map((r: any, idx: number) => ({
        id: `req-${Date.now()}-${idx}`,
        profile_type: r.profile_type,
        count_needed: r.count,
        count_filled: 0,
        budget_per_person: r.budget,
        description: ''
      }))
    };
    setJobs([job, ...jobs]);
    setActiveTab('apps');
  };

  const handleApply = (jobId: string, reqId: string) => {
    if (currentUser?.user_type !== UserType.CANDIDATE) return;
    
    if (applications.find(a => a.job_req_id === reqId && a.candidate_id === currentUser.id)) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      job_req_id: reqId,
      candidate_id: currentUser.id,
      status: ApplicationStatus.PENDING,
      job_title: jobs.find(j => j.id === jobId)?.title
    };
    setApplications([...applications, newApp]);
  };

  const handleUpdateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setApplications(prevApps => {
      const appIndex = prevApps.findIndex(a => a.id === appId);
      if (appIndex === -1) return prevApps;

      const updatedApps = [...prevApps];
      const app = updatedApps[appIndex];
      const oldStatus = app.status;
      updatedApps[appIndex] = { ...app, status };

      // Mirror the database logic: increment count_filled if accepted
      if (status === ApplicationStatus.ACCEPTED && oldStatus !== ApplicationStatus.ACCEPTED) {
        setJobs(prevJobs => prevJobs.map(job => {
          const reqIndex = job.requirements.findIndex(r => r.id === app.job_req_id);
          if (reqIndex !== -1) {
            const updatedReqs = [...job.requirements];
            updatedReqs[reqIndex] = { ...updatedReqs[reqIndex], count_filled: updatedReqs[reqIndex].count_filled + 1 };
            return { ...job, requirements: updatedReqs };
          }
          return job;
        }));
      }

      return updatedApps;
    });
  };

  const handleUpdateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const handleSubmitReview = (review: Omit<Review, 'id' | 'created_at'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setReviews([...reviews, newReview]);
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const isNowCandidate = currentUser.user_type === UserType.ORGANIZER;
    const newRole = isNowCandidate ? UserType.CANDIDATE : UserType.ORGANIZER;
    
    setCurrentUser({
      ...currentUser,
      id: isNowCandidate ? 'cand-rahul-999' : 'user-org-123',
      user_type: newRole,
      full_name: isNowCandidate ? 'Rahul (Candidate)' : 'Vikram (Organizer)',
      profile_pics: isNowCandidate ? ['https://i.pravatar.cc/150?u=rahul'] : ['https://picsum.photos/200/200?random=10']
    });
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'search': return <SearchFeed currentUser={currentUser} jobs={jobs} applications={applications} onApply={handleApply} />;
      case 'publish': return <PublishForm currentUser={currentUser} onPublish={handlePublish} onComplete={() => setActiveTab('apps')} />;
      case 'apps': return (
        <ApplicationsScreen 
          currentUser={currentUser} 
          jobs={jobs} 
          applications={applications} 
          candidateProfiles={candidateProfiles}
          reviews={reviews}
          onUpdateJobStatus={handleUpdateJobStatus}
          onSubmitReview={handleSubmitReview}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      );
      case 'inbox': return <InboxScreen currentUser={currentUser} />;
      case 'profile': return <ProfileScreen currentUser={currentUser} />;
      default: return <SearchFeed currentUser={currentUser} jobs={jobs} applications={applications} onApply={handleApply} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
          <h1 className="text-2xl font-bold blabla-blue tracking-tight">EventForce</h1>
          <button 
            onClick={toggleRole}
            className="flex items-center space-x-2 bg-gray-50 border px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#054752]">
              {currentUser?.user_type} View
            </span>
            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto">
        {renderScreen()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'search' ? 'text-[#00AFF5]' : 'text-gray-400'}`}>
          <SearchIcon /><span className="text-[10px] font-medium mt-1">Posts</span>
        </button>
        <button onClick={() => setActiveTab('publish')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'publish' ? 'text-[#00AFF5]' : 'text-gray-400'}`}>
          <PublishIcon /><span className="text-[10px] font-medium mt-1">Publish</span>
        </button>
        <button onClick={() => setActiveTab('apps')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'apps' ? 'text-[#00AFF5]' : 'text-gray-400'}`}>
          <BriefcaseIcon /><span className="text-[10px] font-medium mt-1">Jobs</span>
        </button>
        <button onClick={() => setActiveTab('inbox')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'inbox' ? 'text-[#00AFF5]' : 'text-gray-400'}`}>
          <ChatIcon /><span className="text-[10px] font-medium mt-1">Inbox</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center flex-1 py-1 ${activeTab === 'profile' ? 'text-[#00AFF5]' : 'text-gray-400'}`}>
          <UserIcon /><span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
