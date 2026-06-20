import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage global platform configurations.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-zinc-50 border-b border-zinc-800 pb-4">General Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Platform Name</label>
            <input type="text" defaultValue="Concert Ticketing Platform" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-emerald-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Support Email</label>
            <input type="email" defaultValue="support@platform.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-emerald-500" />
          </div>
          
          <div className="pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-200 mb-4">Payment Settings</h3>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Default Currency</label>
              <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-50 focus:outline-none focus:border-emerald-500">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">
          <Save size={18} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
