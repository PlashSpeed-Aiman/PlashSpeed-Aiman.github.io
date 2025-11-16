/**
 * Static Activities Data
 * DeTA (Developer Tanahair) Community Activities
 */

export const activities = [
  // Meetup
  {
    id: 1,
    type: 'meetup',
    title: 'DeTA Monthly Meetup: Web Performance Optimization',
    description: 'Join us for our monthly community gathering where we discuss the latest trends in web performance. This session covers Core Web Vitals, lazy loading strategies, and modern bundling techniques. Network with fellow developers and share your experiences.',
    schedule: new Date('2024-12-15T14:00:00'),
    location: 'IIUM Gombak Campus, ICT Building',
    status: 'upcoming',
    image: '/images/activities/meetup-placeholder.jpg',
    tags: ['Web Performance', 'Networking', 'Community'],
    recurring: true,
    frequency: 'monthly',
    attendeeCount: 45,
    capacity: 60,
    topics: ['Core Web Vitals', 'Lazy Loading', 'Bundle Optimization']
  },

  // Hackathon
  {
    id: 2,
    type: 'hackathon',
    title: 'DeTA Hackathon 2024: Build for Impact',
    description: 'A 48-hour intensive coding competition focused on creating solutions for real-world community problems. Form teams of 3-5 developers and compete for exciting prizes while making a difference. Mentorship and workshops provided throughout the event.',
    schedule: new Date('2025-01-20T09:00:00'),
    endDate: new Date('2025-01-22T17:00:00'),
    location: 'IIUM Innovation & Entrepreneurship Center',
    status: 'upcoming',
    image: '/images/activities/hackathon-placeholder.jpg',
    tags: ['Competition', 'Team Building', 'Innovation'],
    duration: '48 hours',
    theme: 'Social Impact & Sustainability',
    teamSize: { min: 3, max: 5 },
    prizes: {
      first: 'RM 3,000 + Tech Vouchers',
      second: 'RM 2,000 + Tech Vouchers',
      third: 'RM 1,000 + Tech Vouchers'
    },
    technologies: ['React', 'Vue', 'Node.js', 'Python', 'Mobile Development'],
    registrationDeadline: new Date('2025-01-15T23:59:59')
  },

  // Workshop
  {
    id: 3,
    type: 'workshop',
    title: 'Hands-on Vue 3 Composition API Workshop',
    description: 'An interactive workshop designed for developers looking to master Vue 3\'s Composition API. Learn through practical exercises covering reactive state, composables, lifecycle hooks, and best practices. All participants receive completion certificates.',
    schedule: new Date('2024-12-08T10:00:00'),
    location: 'Online via Zoom',
    status: 'upcoming',
    image: '/images/activities/workshop-placeholder.jpg',
    tags: ['Vue.js', 'Hands-on', 'Frontend'],
    skillLevel: 'Intermediate',
    instructor: {
      name: 'Dr. Ahmad Ibrahim',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovators Sdn Bhd',
      bio: '10+ years in web development, Vue.js core contributor'
    },
    duration: '4 hours',
    capacity: 30,
    enrolled: 18,
    prerequisites: ['Basic JavaScript knowledge', 'Familiarity with Vue 2 or React'],
    learningOutcomes: [
      'Master Vue 3 Composition API fundamentals',
      'Build reusable composables',
      'Implement complex state management',
      'Apply best practices in real projects'
    ],
    materials: ['GitHub repository', 'Slide deck', 'Code examples'],
    certificate: true,
    interactive: true
  },

  // Alumni Talk
  {
    id: 4,
    type: 'alumni-talk',
    title: 'From Campus to Silicon Valley: A Journey in Tech',
    description: 'Join us for an inspiring session with Siti Nurhaliza Rahman, IIUM alumna now working as a Senior Software Engineer at a leading tech company in Silicon Valley. Discover her career journey, insights on international opportunities, and practical advice for aspiring tech professionals. Q&A session included.',
    schedule: new Date('2024-12-01T15:00:00'),
    location: 'Hybrid (On-campus + Online)',
    status: 'upcoming',
    image: '/images/activities/alumni-talk-placeholder.jpg',
    tags: ['Career', 'Inspiration', 'Alumni'],
    speaker: {
      name: 'Siti Nurhaliza Rahman',
      company: 'TechGiant Inc.',
      position: 'Senior Software Engineer',
      graduationYear: 2018,
      degree: 'Bachelor of IT (Hons.)',
      linkedin: 'https://linkedin.com/in/siti-nurhaliza-rahman',
      expertise: ['Distributed Systems', 'Cloud Architecture', 'Engineering Leadership'],
      bio: 'Graduated from IIUM in 2018 and worked her way from a junior developer in Kuala Lumpur to a senior engineer at a Fortune 500 tech company in Silicon Valley. Passionate about mentoring young developers.',
      currentFocus: 'Building scalable microservices architecture',
      industry: 'Cloud Computing & Infrastructure'
    },
    highlights: [
      'Career transition strategies',
      'Working in international tech hubs',
      'Technical skills that matter',
      'Work-life balance in tech'
    ],
    qnaSession: true,
    recordingAvailable: true,
    capacity: 100,
    registered: 67
  }
]

/**
 * Get activities by type
 */
export function getActivitiesByType(type) {
  return activities.filter(activity => activity.type === type)
}

/**
 * Get activities by status
 */
export function getActivitiesByStatus(status) {
  return activities.filter(activity => activity.status === status)
}

/**
 * Get upcoming activities sorted by date
 */
export function getUpcomingActivities() {
  return activities
    .filter(activity => activity.status === 'upcoming')
    .sort((a, b) => a.schedule - b.schedule)
}

/**
 * Get activity by ID
 */
export function getActivityById(id) {
  return activities.find(activity => activity.id === id)
}

/**
 * Activity type metadata
 */
export const activityTypes = {
  meetup: {
    name: 'Meetups',
    description: 'Regular gatherings for networking, knowledge sharing, and community building',
    icon: '👥',
    color: 'amber'
  },
  hackathon: {
    name: 'Hackathons',
    description: 'Intensive coding competitions to solve real-world problems and build innovative projects',
    icon: '🏆',
    color: 'orange'
  },
  workshop: {
    name: 'Workshops',
    description: 'Hands-on learning sessions to master new technologies and practical skills',
    icon: '🛠️',
    color: 'stone'
  },
  'alumni-talk': {
    name: 'Alumni Talks',
    description: 'Insightful sessions with IIUM graduates sharing industry experiences and career guidance',
    icon: '💡',
    color: 'slate'
  }
}

export default activities
