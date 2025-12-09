import KanbanBoard, { Column } from '@/components/KanbanBoard'

const initialData: Column[] = [
  {
    id: 'planning',
    title: 'PLANNING',
    tasks: [
      {
        id: 'task-1',
        title: 'Google Ads: Q4 Promo',
        description: 'Plan and strategize Q4 promotional campaign for Google Ads',
        metrics: '75%',
        progress: 75,
        icon: '📊',
      },
      {
        id: 'task-2',
        title: 'Facebook: Holiday Blast',
        description: 'Create holiday campaign strategy for Facebook platform',
        metrics: '60%',
        progress: 60,
        icon: '📱',
      },
      {
        id: 'task-3',
        title: 'Instagram: Influencer Collab',
        description: 'Identify and reach out to influencers for collaboration',
        metrics: '45%',
        progress: 45,
        icon: '📷',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'IN PROGRESS',
    tasks: [
      {
        id: 'task-4',
        title: 'Facebook: Holiday Blast',
        description: 'Executing holiday campaign on Facebook with targeted ads',
        metrics: '85%',
        progress: 85,
        icon: '📱',
      },
      {
        id: 'task-5',
        title: 'Facebook: Holiday Blast',
        description: 'A/B testing different ad variations for optimal performance',
        metrics: '70%',
        progress: 70,
        icon: '📱',
      },
      {
        id: 'task-6',
        title: 'Instagram: Influencer Collab',
        description: 'Collaborating with influencers on content creation',
        metrics: '92%',
        progress: 92,
        icon: '📷',
      },
      {
        id: 'task-7',
        title: 'SEO: Content Optimization',
        description: 'Optimizing website content for search engines',
        metrics: '65%',
        progress: 65,
        icon: '🔍',
      },
    ],
  },
  {
    id: 'review',
    title: 'REVIEW',
    tasks: [
      {
        id: 'task-8',
        title: 'Instagram: Influencer Collab',
        description: 'Review influencer content and performance metrics',
        metrics: '88%',
        progress: 88,
        icon: '📷',
      },
    ],
  },
  {
    id: 'completed',
    title: 'COMPLETED',
    tasks: [
      {
        id: 'task-9',
        title: 'SEO: Content Optimization',
        description: 'Successfully optimized 50+ pages for target keywords',
        metrics: '100%',
        progress: 100,
        icon: '✅',
      },
      {
        id: 'task-10',
        title: 'SEO: Content Optimization',
        description: 'Completed technical SEO audit and fixes',
        metrics: '100%',
        progress: 100,
        icon: '✅',
      },
      {
        id: 'task-11',
        title: 'SEO: Content Optimization',
        description: 'Published new blog content with optimized keywords',
        metrics: '100%',
        progress: 100,
        icon: '✅',
      },
    ],
  },
  {
    id: 'archive',
    title: 'ARCHIVE',
    tasks: [
      {
        id: 'task-12',
        title: 'SEO: Content Optimization',
        description: 'Archived Q3 SEO campaign data and reports',
        metrics: '100%',
        progress: 100,
        icon: '📦',
      },
      {
        id: 'task-13',
        title: 'SEO: Content Optimization',
        description: 'Historical data from summer campaign',
        metrics: '100%',
        progress: 100,
        icon: '📦',
      },
      {
        id: 'task-14',
        title: 'SEO: Content Optimization',
        description: 'Archived previous optimization attempts',
        metrics: '100%',
        progress: 100,
        icon: '📦',
      },
    ],
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <KanbanBoard initialColumns={initialData} />
    </main>
  )
}
