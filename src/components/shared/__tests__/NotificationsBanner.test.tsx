import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationsBanner } from '../banners/NotificationsBanner';
import { vi } from 'vitest';
import * as useNotificationsBannerModule from '@/hooks/bannerHooks/useNotificationsBanner';

const mockNotificationBanner = {
    title: 'This is a notification message',
    text: 'This is the notification context',
    action1Label: 'Action 1',
    action2Label: 'Action 2',
    isOpen: true,
    closeBanner: vi.fn(),
};

describe('Checks notifications banner alert', () => {
    it('renders notification banner with message and closes on button click', async () => {
        const user = userEvent.setup();

        vi.spyOn(useNotificationsBannerModule, 'useNotificationsBanner').mockReturnValue(mockNotificationBanner);

        const { getByText, getByTestId } = render(<NotificationsBanner />);

        expect(getByText(mockNotificationBanner.title)).toBeInTheDocument();
        expect(getByText(mockNotificationBanner.text)).toBeInTheDocument();
        expect(getByText(mockNotificationBanner.action1Label)).toBeInTheDocument();
        expect(getByText(mockNotificationBanner.action2Label)).toBeInTheDocument();

        const closeButton = getByTestId('CloseIcon');
        await user.click(closeButton);
        expect(mockNotificationBanner.closeBanner).toHaveBeenCalled();
    });
});