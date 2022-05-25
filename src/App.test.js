import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// for README
global.fetch = () =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(''),
  });

describe('App', () => {
  test('create', async () => {
    const user = userEvent.setup();
    const { asFragment } = await render(<App />);
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByTitle('start a new design'));
    expect(asFragment()).toMatchSnapshot();

    await user.type(screen.getByLabelText('name'), 'test design');
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByTitle('create design'));
    expect(asFragment()).toMatchSnapshot();

    await user.click(screen.getByTitle('Use selected screen template'));
    expect(asFragment()).toMatchSnapshot();

    // await user.click(screen.getByText('PageContent'));
    // expect(asFragment()).toMatchSnapshot();

    // await user.click(screen.getByText('PageContent'));
    // expect(asFragment()).toMatchSnapshot();

    // await user.click(screen.getByTitle('add a component'));
    // expect(asFragment()).toMatchSnapshot();
  });
});
