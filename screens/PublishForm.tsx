
import React, { useState } from 'react';
import { Profile } from '../types';

interface PublishFormProps {
  currentUser: Profile | null;
  onPublish: (jobData: any) => void;
  onComplete: () => void;
}

const PublishForm: React.FC<PublishFormProps> = ({ currentUser, onPublish, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    location_text: '',
    date: '',
    startTime: '',
    endTime: '',
    requirements: [{ profile_type: '', count: 1, budget: 0 }],
    dress_male: '',
    dress_female: '',
    facilities: { food: false, travel: false, stay: false }
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const addReq = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, { profile_type: '', count: 1, budget: 0 }]
    });
  };

  const handlePublish = () => {
    onPublish(formData);
    onComplete();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#054752] mb-2">Publish a Job</h2>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 transition-colors ${step >= s ? 'bg-[#00AFF5]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Event Title</span>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Dream Wedding 2024" className="mt-2 block w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5 focus:ring-[#00AFF5] focus:border-[#00AFF5]" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Location</span>
              <input type="text" value={formData.location_text} onChange={e => setFormData({...formData, location_text: e.target.value})} placeholder="Location name or link" className="mt-2 block w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5 focus:ring-[#00AFF5] focus:border-[#00AFF5]" />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Manpower Requirements</h3>
            {formData.requirements.map((req, idx) => (
              <div key={idx} className="p-4 border border-blue-50 bg-blue-50/20 rounded-2xl space-y-4">
                <input type="text" placeholder="Profile Type (e.g. Runner)" className="w-full rounded-xl border-none bg-white p-3 text-sm" onChange={e => {
                  const newReqs = [...formData.requirements];
                  newReqs[idx].profile_type = e.target.value;
                  setFormData({...formData, requirements: newReqs});
                }} />
                <div className="flex space-x-3">
                  <input type="number" placeholder="Count" className="w-1/3 rounded-xl border-none bg-white p-3 text-sm" onChange={e => {
                    const newReqs = [...formData.requirements];
                    newReqs[idx].count = parseInt(e.target.value);
                    setFormData({...formData, requirements: newReqs});
                  }} />
                  <input type="number" placeholder="Budget per candidate (₹)" className="w-2/3 rounded-xl border-none bg-white p-3 text-sm" onChange={e => {
                    const newReqs = [...formData.requirements];
                    newReqs[idx].budget = parseInt(e.target.value);
                    setFormData({...formData, requirements: newReqs});
                  }} />
                </div>
              </div>
            ))}
            <button onClick={addReq} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-400 font-bold rounded-2xl">
              + Add Profile
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block"><span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Date</span>
              <input type="date" className="mt-2 block w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5" onChange={e => setFormData({...formData, date: e.target.value})} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label><span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Start</span>
                <input type="time" className="mt-2 block w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5" onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </label>
              <label><span className="text-sm font-bold text-gray-500 uppercase tracking-wide">End</span>
                <input type="time" className="mt-2 block w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5" onChange={e => setFormData({...formData, endTime: e.target.value})} />
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <input type="text" placeholder="Male Dress Code" className="w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5" onChange={e => setFormData({...formData, dress_male: e.target.value})} />
            <input type="text" placeholder="Female Dress Code" className="w-full rounded-2xl border-gray-200 bg-gray-50 py-4 px-5" onChange={e => setFormData({...formData, dress_female: e.target.value})} />
            <div className="space-y-2">
              {['food', 'travel', 'stay'].map(f => (
                <label key={f} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                  <input type="checkbox" className="rounded text-[#00AFF5]" onChange={e => setFormData({...formData, facilities: {...formData.facilities, [f]: e.target.checked}})} />
                  <span className="capitalize font-medium">{f} Provided</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 flex space-x-3">
          {step > 1 && <button onClick={prevStep} className="flex-1 py-4 font-bold text-gray-500 border-2 rounded-2xl">Back</button>}
          <button onClick={step < 4 ? nextStep : handlePublish} className="flex-[2] py-4 bg-[#00AFF5] text-white font-bold rounded-2xl">
            {step < 4 ? 'Continue' : 'Publish Job'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishForm;
