import React from 'react';
import { Button } from '@/components/ui/button';
import { lendingPool } from '@/constants/addresses';
import { poolAbi } from '@/lib/abi/poolAbi';
import { useReadContract } from 'wagmi';

function CreatePosition() {
    const handleCreatePosition = async () => {
        try {
            await useReadContract({
                address: lendingPool,
                abi: poolAbi,
                functionName: 'createPosition',
                args: [],
            });
        } catch (error) {
            console.error('Error creating position:', error);
        }
    };

    return (
        <Button onClick={handleCreatePosition}>Create Position</Button>
    );
}

export default CreatePosition;
