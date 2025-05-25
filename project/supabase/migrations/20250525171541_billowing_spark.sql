/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text)
      - `role` (text)
      - `is_first_login` (boolean)
      - `roll_number` (text, nullable)
      - `section_id` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sections`
      - `id` (uuid, primary key)
      - `name` (text)
      - `faculty_id` (uuid, references users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `experiments`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `pdf_url` (text, nullable)
      - `faculty_id` (uuid, references users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `viva_questions`
      - `id` (uuid, primary key)
      - `experiment_id` (uuid, references experiments)
      - `question` (text)
      - `options` (text[])
      - `correct_option_index` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `student_experiment_status`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references users)
      - `experiment_id` (uuid, references experiments)
      - `packet_tracer_completed` (boolean)
      - `experiment_completed` (boolean)
      - `pdf_submitted` (boolean)
      - `pdf_url` (text, nullable)
      - `viva_completed` (boolean)
      - `viva_answers` (jsonb)
      - `viva_score` (integer)
      - `faculty_remarks` (text, nullable)
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('faculty', 'student')),
  is_first_login boolean DEFAULT true,
  roll_number text,
  section_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sections table
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  faculty_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Experiments table
CREATE TABLE experiments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  pdf_url text,
  faculty_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Viva questions table
CREATE TABLE viva_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id uuid REFERENCES experiments(id) ON DELETE CASCADE,
  question text NOT NULL,
  options text[] NOT NULL,
  correct_option_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Student experiment status table
CREATE TABLE student_experiment_status (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id) ON DELETE CASCADE,
  packet_tracer_completed boolean DEFAULT false,
  experiment_completed boolean DEFAULT false,
  pdf_submitted boolean DEFAULT false,
  pdf_url text,
  viva_completed boolean DEFAULT false,
  viva_answers jsonb DEFAULT '[]'::jsonb,
  viva_score integer,
  faculty_remarks text,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE viva_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_experiment_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Sections policies
CREATE POLICY "Anyone can read sections"
  ON sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty can create sections"
  ON sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'faculty'
    )
  );

-- Experiments policies
CREATE POLICY "Anyone can read experiments"
  ON experiments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty can manage experiments"
  ON experiments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'faculty'
    )
  );

-- Viva questions policies
CREATE POLICY "Anyone can read viva questions"
  ON viva_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Faculty can manage viva questions"
  ON viva_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'faculty'
    )
  );

-- Student experiment status policies
CREATE POLICY "Students can read own status"
  ON student_experiment_status
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'faculty'
    )
  );

CREATE POLICY "Students can update own status"
  ON student_experiment_status
  FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Faculty can manage student status"
  ON student_experiment_status
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'faculty'
    )
  );