import MainLayout from '@/components/layouts/main-layout';
import { PromptOptimizer } from '@/components/features/prompt-optimizer';

export default function Home() {
  return (
    <MainLayout>
      <PromptOptimizer />
    </MainLayout>
  );
}