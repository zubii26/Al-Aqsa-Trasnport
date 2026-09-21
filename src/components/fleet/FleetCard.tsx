import Image from 'next/image';
import type { Vehicle } from './types';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, Check } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface FleetCardProps {
  vehicle: Vehicle;
  isActive: boolean;
  priority: boolean;
}

export function FleetCard({ vehicle, isActive, priority }: FleetCardProps) {
  const router = useRouter();
  
  return (
    <article
      className={`relative w-full rounded-[24px] p-5 md:p-6 transition-all duration-300 flex flex-col h-full ${
        isActive
          ? 'bg-white dark:bg-slate-900 shadow-[0_30px_60px_-12px_rgba(212,175,55,0.15)] border border-secondary z-20'
          : 'bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border border-slate-100 dark:border-slate-800'
      }`}
      itemScope
      itemType="https://schema.org/Vehicle"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] mb-4 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-800/50 rounded-xl overflow-hidden flex items-center justify-center p-4">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className={`object-contain transition-transform duration-700 ease-out ${isActive ? 'scale-105' : 'scale-100'}`}
          sizes="(max-width: 640px) 260px, 300px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 itemProp="name" className={`font-serif font-bold text-slate-900 dark:text-white mb-1 transition-all ${isActive ? 'text-2xl' : 'text-lg'}`}>
          {vehicle.name}
        </h3>

        <div className="flex flex-col mb-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                Starting from
            </span>
            <p itemProp="offers" className={`font-bold text-secondary flex items-baseline gap-1 ${isActive ? 'text-2xl' : 'text-lg'}`}>
                {vehicle.price ? vehicle.price.replace(/from\s+/i, '').trim() : 'Contact Us'}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 lowercase">/ trip</span>
            </p>
        </div>

        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-xs mb-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5">
                <Users size={14} className="text-secondary/80" />
                <span>{vehicle.passengers} <span className="hidden sm:inline">Passengers</span></span>
            </div>
            <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-secondary/80" />
                <span>{vehicle.luggage} <span className="hidden sm:inline">Bags</span></span>
            </div>
        </div>

        {/* Amenities */}
        {isActive ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {vehicle.features.slice(0, 3).map((a) => (
              <span key={a} className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Check size={10} className="text-secondary" />
                {a.split(' ')[0]}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mb-4">
            + {vehicle.features.length} premium amenities
          </p>
        )}

        {/* Button */}
        {isActive && (
            <div className="mt-auto pt-2 space-y-2">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(`/booking?vehicle=${vehicle.id}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B1221] hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0B1221] py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
                >
                    Book {vehicle.name} <ArrowRight size={16} className="text-secondary" />
                </button>
                {/* @ts-ignore */}
                {vehicle.slug && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            // @ts-ignore
                            router.push(`/fleet/${vehicle.slug}`);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 py-3.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all hover:border-secondary/30 active:scale-[0.98]"
                    >
                        View full details
                    </button>
                )}
            </div>
        )}
      </div>
    </article>
  );
}
