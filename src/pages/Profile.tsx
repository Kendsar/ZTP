import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Mail, MapPin, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../main';


interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  location: string;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!user) throw new Error("User not found");
  
      // Update email in authentication table (if changed)
      if (data.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({ email: data.email });
        if (authError) throw new Error(authError.message);
      }
  
      // Update other user details in the `users` table
      const { error: dbError } = await supabase
        .from("users")
        .update({
          name: data.name,
          bio: data.bio,
          location: data.location,
        })
        .eq("id", user.id);
  
      if (dbError) throw new Error(dbError.message);
  
      // Update local user state
      updateUser(data);
  
      setIsEditing(false);
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-custom p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary hover:text-primary/90 font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline-block mr-2" />
                Full Name
              </label>
              <input
                {...register('name')}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline-block mr-2" />
                Location
              </label>
              <input
                {...register('location')}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              {...register('bio')}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}