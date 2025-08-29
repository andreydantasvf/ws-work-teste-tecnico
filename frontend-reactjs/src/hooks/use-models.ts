import { useQuery } from '@tanstack/react-query';
import { modelService } from '@/services/model.service';

export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: modelService.getModels,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
