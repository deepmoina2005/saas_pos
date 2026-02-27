import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from './authAPI';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tenant_name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(formData);
      setStep(3); // Success step
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. This email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-200">
              <Store className="w-8 h-8" />
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">POS<span className="text-indigo-600">Genius</span></h1>
           <p className="text-slate-500 mt-2">Start your 14-day free trial today.</p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">Step 1: Business Details</h2>
                  <p className="text-sm text-slate-500">Tell us the name of your shop or business.</p>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Store className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input 
                      className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white" 
                      placeholder="Your Store Name" 
                      value={formData.tenant_name}
                      onChange={(e) => setFormData({...formData, tenant_name: e.target.value})}
                    />
                  </div>
                  <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base font-bold gap-2" 
                          disabled={!formData.tenant_name} 
                          onClick={() => setStep(2)}>
                    Next Step <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">Step 2: Create Admin Account</h2>
                  <p className="text-sm text-slate-500">You will be the primary owner of this instance.</p>
                </div>
                <div className="space-y-4">
                   <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input required className="pl-10 h-12 bg-slate-50 border-slate-200" placeholder="Full Name" 
                           value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input required type="email" className="pl-10 h-12 bg-slate-50 border-slate-200" placeholder="Email Address"
                           value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input required type="password" className="pl-10 h-12 bg-slate-50 border-slate-200" placeholder="Secure Password"
                           value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                  
                  {error && <p className="text-xs text-rose-500 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}

                  <div className="flex gap-3 pt-2">
                     <Button variant="ghost" className="flex-1 h-12" onClick={() => setStep(1)} type="button">Back</Button>
                     <Button className="flex-[2] h-12 bg-indigo-600 hover:bg-indigo-700 text-base font-bold" 
                             disabled={loading} type="submit">
                        {loading ? 'Creating Account...' : 'Finish Setup'}
                     </Button>
                  </div>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-500">
                 <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">All Set!</h2>
                    <p className="text-slate-500 mt-2">Your POS instance for <b>{formData.tenant_name}</b> is ready. You can now log in and start selling.</p>
                 </div>
                 <Button asChild className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base font-bold shadow-lg shadow-indigo-100">
                    <Link to="/login">Go to Login</Link>
                 </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {step !== 3 && (
          <p className="text-center mt-8 text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
