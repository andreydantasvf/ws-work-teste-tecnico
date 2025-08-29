import { useQuery } from '@tanstack/react-query';
import { carService } from '@/services/car.service';

export const useCars = () => {
  return useQuery({
    queryKey: ['cars'],
    queryFn: carService.getCars,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
