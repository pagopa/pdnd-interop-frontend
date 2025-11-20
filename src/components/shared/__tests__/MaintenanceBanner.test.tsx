import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import * as useMaintenanceBannerModule from '@/hooks/bannerHooks/useMaintenanceBanner';
import { MaintenanceBanner } from '../banners/MaintenanceBanner';

const mockMaintenanceHookData = {
    title: 'This is a maintenance message',
    text: 'This is the maintenance context',
    isOpen: true,
    closeBanner: vi.fn(),
};

describe('Checks maintenance banner alert', () => {
    it('renders maintenance banner with message and closes on button click', async () => {
        const user = userEvent.setup();

        vi.spyOn(useMaintenanceBannerModule, 'useMaintenanceBanner').mockReturnValue(mockMaintenanceHookData);

        const { getByText, getByTestId } = render(<MaintenanceBanner />);

        expect(getByText(mockMaintenanceHookData.title)).toBeInTheDocument();
        expect(getByText(mockMaintenanceHookData.text)).toBeInTheDocument();

        const closeButton = getByTestId('CloseIcon');
        await user.click(closeButton);
        expect(mockMaintenanceHookData.closeBanner).toHaveBeenCalled();
    });
});