import { BMICalculator } from '@/components/bmi-calculator';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <BMICalculator />
      </main>
    </div>
  );
}
