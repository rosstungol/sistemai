const features = [
	'Generate architecture from natural language prompts',
	'Collaborate in real time on a shared canvas',
	'Import starter templates for common design patterns',
	'Auto-generate technical specifications from your design',
]

export function AuthContent() {
	return (
		<section className='hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:border-border-default lg:border-r lg:bg-bg-surface lg:p-12'>
			<div className='mx-auto max-w-sm'>
				<span className='font-bold text-2xl tracking-tight'>SistemAI</span>
				<h1 className='mt-8 font-bold text-3xl'>Design systems together.</h1>
				<p className='mt-3 text-base'>
					AI-powered collaborative system design workspace
				</p>
				<ul className='mt-8 space-y-4'>
					{features.map((feature) => (
						<li key={feature} className='flex gap-3'>
							<span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-primary' />
							<span className='text-sm text-text-muted'>{feature}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
