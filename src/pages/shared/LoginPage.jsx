import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';
import { loginUser } from '../../services/authService';
import { Leaf } from 'lucide-react';

const LoginPage = ({ role }) => {
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state, login } = useAppContext();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    let credentials = {};
    if (role === 'FARMER') {
      credentials = { mobile: identifier, otp: secret };
    } else {
      credentials = { id: identifier, password: secret };
    }

    const response = loginUser(state, role, credentials);
    if (response.success) {
      login(response.user);
      navigate(`/${role.toLowerCase()}/dashboard`);
    } else {
      setError(response.message);
    }
  };

  const fillDemo = () => {
    if (role === 'FARMER') {
      setIdentifier('9876543210');
      setSecret('123456');
    } else if (role === 'STAFF') {
      setIdentifier('STAFF001');
      setSecret('1234');
    } else if (role === 'ADMIN') {
      setIdentifier('ADMIN001');
      setSecret('1234');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-forest-600 p-3 rounded-xl shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>{role} Portal</CardTitle>
            <CardDescription>
              Sign in to access the KisanQueue {role.toLowerCase()} dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-earth-700">
                  {role === 'FARMER' ? 'Mobile Number' : 'ID'}
                </label>
                <Input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'FARMER' ? 'Enter mobile number' : 'Enter your ID'}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-earth-700">
                  {role === 'FARMER' ? 'OTP' : 'Password'}
                </label>
                <Input
                  type={role === 'FARMER' ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder={role === 'FARMER' ? 'Enter OTP' : 'Enter password'}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-earth-100 pt-4">
            <Button variant="ghost" size="sm" onClick={fillDemo} className="text-xs">
              Fill Demo Credentials
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
