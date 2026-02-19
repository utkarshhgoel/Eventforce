
import React from 'react';
import { Profile } from '../types';

interface ProfileScreenProps {
  currentUser: Profile | null;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser }) => {
  if (!currentUser) return null;

  return (
    <div className="p-0 space-y-0">
      {/* Top Profile Card */}
      <div className="bg-white p-8 space-y-6 text-center border-b shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 blabla-bg-blue opacity-10"></div>
        <div className="relative pt-8">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl overflow-hidden mb-4">
            <img src={currentUser.profile_pics[0]} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#054752]">{currentUser.full_name}</h2>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="bg-blue-100 text-[#00AFF5] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {currentUser.user_type}
            </span>
            <div className="flex items-center text-yellow-500 font-bold">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {currentUser.rating}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Bio Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Bio</h3>
          <p className="text-[#054752] leading-relaxed font-medium">
            {currentUser.bio}
          </p>
        </section>

        {/* Experience Tags */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Experience</h3>
          <div className="flex flex-wrap gap-2">
            {['Luxury Weddings', 'Tech Expos', 'VIP Security', 'Hospitality', '3+ Years'].map(tag => (
              <span key={tag} className="px-5 py-2.5 bg-gray-100 rounded-2xl text-sm font-bold text-[#054752]">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Work Gallery</h3>
          <div className="grid grid-cols-2 gap-3">
            {[2, 3, 4, 5].map(n => (
              <div key={n} className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <img src={`https://picsum.photos/400/400?random=${n}`} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Settings/Logout (CTA style) */}
        <button className="w-full py-5 text-[#00AFF5] font-extrabold border-2 border-blue-50 bg-blue-50/20 rounded-3xl active:scale-[0.98] transition-all">
          Edit Professional Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
