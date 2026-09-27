import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { UserRole } from '../types';
import {
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  Building,
  AlertCircle,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Award,
  Globe,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>('Startup');
  const [orgName, setOrgName] = useState<string>('');

  // Government fields
  const [ministryOrState, setMinistryOrState] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [officialId, setOfficialId] = useState<string>('');

  // Startup fields
  const [cinNumber, setCinNumber] = useState<string>('');
  const [dpiitNumber, setDpiitNumber] = useState<string>('');
  const [registeredAddress, setRegisteredAddress] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [authorizedRepresentative, setAuthorizedRepresentative] =
    useState<string>('');

  // Evaluator / Validator fields
  const [expertise, setExpertise] = useState<string>('');
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [qualifications, setQualifications] = useState<string>('');
  const [professionalProfile, setProfessionalProfile] =
    useState<string>('');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register({
        email,
        password,
        full_name: fullName,
        role,
        organization_name: orgName || 'Independent',
        org_type:
          role === 'Government Department'
            ? 'Department'
            : role === 'Startup'
              ? 'Startup'
              : role,
      });

      navigate('/login', {
        state: { from: fromLocation },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const roles: UserRole[] = [
    'Government Department',
    'Startup',
    'Evaluator',
    'Independent Validator',
  ];

  const inputClass = 'input-field h-10 text-xs w-full';

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-900 border border-blue-700 mx-auto flex items-center justify-center text-white shadow-xs">
            <UserPlus className="w-6 h-6 text-blue-200" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Create SetuStart Account
          </h1>

          <p className="text-xs text-slate-600">
            Join the governed public sector innovation ecosystem
          </p>
        </div>

        <div className="gov-panel p-6 space-y-4">

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ================= COMMON DETAILS ================= */}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Email Address
              </label>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@organization.gov.in"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mobile Number
              </label>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>

                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value)
                  }
                  className={inputClass}
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as UserRole)
                }
                className="select-field h-10 text-xs w-full"
              >
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ================= GOVERNMENT DEPARTMENT ================= */}

            {role === 'Government Department' && (
              <div className="border-t border-slate-200 pt-4 space-y-4">

                <p className="text-xs font-extrabold text-blue-800">
                  Government Department Verification Details
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ministry / State / UT
                  </label>

                  <input
                    type="text"
                    value={ministryOrState}
                    onChange={(e) =>
                      setMinistryOrState(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. Ministry of Housing & Urban Affairs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Department Name
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) =>
                        setOrgName(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="e.g. Dept of Urban Sanitation"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Department / Organization ID
                  </label>

                  <input
                    type="text"
                    value={departmentId}
                    onChange={(e) =>
                      setDepartmentId(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter department ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Designation
                  </label>

                  <input
                    type="text"
                    value={designation}
                    onChange={(e) =>
                      setDesignation(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. Nodal Officer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Employee / Official ID
                  </label>

                  <input
                    type="text"
                    value={officialId}
                    onChange={(e) =>
                      setOfficialId(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter official ID"
                    required
                  />
                </div>

              </div>
            )}

            {/* ================= STARTUP ================= */}

            {role === 'Startup' && (
              <div className="border-t border-slate-200 pt-4 space-y-4">

                <p className="text-xs font-extrabold text-blue-800">
                  Startup Verification Details
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Startup / Company Name
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) =>
                        setOrgName(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Enter registered company name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    CIN / Registration Number
                  </label>

                  <input
                    type="text"
                    value={cinNumber}
                    onChange={(e) =>
                      setCinNumber(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter CIN / registration number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    DPIIT Startup Recognition Number
                  </label>

                  <input
                    type="text"
                    value={dpiitNumber}
                    onChange={(e) =>
                      setDpiitNumber(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter DPIIT recognition number (if applicable)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registered Address
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={registeredAddress}
                      onChange={(e) =>
                        setRegisteredAddress(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Registered company address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Industry / Sector
                  </label>

                  <input
                    type="text"
                    value={industry}
                    onChange={(e) =>
                      setIndustry(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. CleanTech, HealthTech"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Authorized Representative Name
                  </label>

                  <input
                    type="text"
                    value={authorizedRepresentative}
                    onChange={(e) =>
                      setAuthorizedRepresentative(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Name of authorized representative"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Company Website
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>

                    <input
                      type="url"
                      value={website}
                      onChange={(e) =>
                        setWebsite(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ================= EVALUATOR ================= */}

            {role === 'Evaluator' && (
              <div className="border-t border-slate-200 pt-4 space-y-4">

                <p className="text-xs font-extrabold text-blue-800">
                  Evaluator Verification Details
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Organization Name
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) =>
                        setOrgName(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Organization ID
                  </label>

                  <input
                    type="text"
                    value={departmentId}
                    onChange={(e) =>
                      setDepartmentId(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter organization ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Designation
                  </label>

                  <input
                    type="text"
                    value={designation}
                    onChange={(e) =>
                      setDesignation(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. Senior Technical Evaluator"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Area of Expertise
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={expertise}
                      onChange={(e) =>
                        setExpertise(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="e.g. AI, IoT, Smart Cities"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Years of Experience
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={yearsOfExperience}
                    onChange={(e) =>
                      setYearsOfExperience(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. 8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Professional Profile
                  </label>

                  <input
                    type="url"
                    value={professionalProfile}
                    onChange={(e) =>
                      setProfessionalProfile(e.target.value)
                    }
                    className={inputClass}
                    placeholder="LinkedIn / professional profile"
                  />
                </div>

              </div>
            )}

            {/* ================= INDEPENDENT VALIDATOR ================= */}

            {role === 'Independent Validator' && (
              <div className="border-t border-slate-200 pt-4 space-y-4">

                <p className="text-xs font-extrabold text-blue-800">
                  Independent Validator Verification Details
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Organization / Validation Agency
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) =>
                        setOrgName(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Enter organization / agency"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Organization ID
                  </label>

                  <input
                    type="text"
                    value={departmentId}
                    onChange={(e) =>
                      setDepartmentId(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter organization ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Designation
                  </label>

                  <input
                    type="text"
                    value={designation}
                    onChange={(e) =>
                      setDesignation(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. Independent Audit Lead"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Domain Expertise
                  </label>

                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) =>
                      setExpertise(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. Cybersecurity, Healthcare"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Qualifications / Certifications
                  </label>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                      <Award className="w-4 h-4" />
                    </div>

                    <input
                      type="text"
                      value={qualifications}
                      onChange={(e) =>
                        setQualifications(e.target.value)
                      }
                      className={inputClass}
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Relevant qualifications / certifications"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Years of Experience
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={yearsOfExperience}
                    onChange={(e) =>
                      setYearsOfExperience(e.target.value)
                    }
                    className={inputClass}
                    placeholder="e.g. 10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Professional Profile
                  </label>

                  <input
                    type="url"
                    value={professionalProfile}
                    onChange={(e) =>
                      setProfessionalProfile(e.target.value)
                    }
                    className={inputClass}
                    placeholder="Professional profile / website"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">

                  <label className="flex items-start gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5"
                    />

                    <span>
                      I declare that I am independent of the parties
                      involved in the evaluation.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5"
                    />

                    <span>
                      I agree to the conflict-of-interest policy.
                    </span>
                  </label>

                </div>

              </div>
            )}

            {/* ================= PASSWORD ================= */}

            <div className="border-t border-slate-200 pt-4">

              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Password
              </label>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className={inputClass}
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter account password"
                  required
                />
              </div>
            </div>

            {/* ================= VERIFICATION NOTICE ================= */}

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">

              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 shrink-0 mt-0.5" />

                <p>
                  Registration details will be reviewed for
                  organization and role verification before access
                  is activated.
                </p>
              </div>

            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-10 py-2.5 text-xs font-bold shadow-xs"
            >
              {loading
                ? 'Submitting Registration...'
                : 'Submit Registration'}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link
            to="/login"
            state={{ from: fromLocation }}
            className="text-blue-700 hover:underline font-bold"
          >
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
};