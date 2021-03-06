import click
from flask.cli import with_appcontext

from .models import Proposal, db


@click.command()
@click.argument('stage')
@click.argument('user_id')
@click.argument('proposal_id')
@click.argument('title')
@click.argument('content')
@with_appcontext
def create_proposal(stage, user_id, proposal_id, title, content):
    proposal = Proposal.create(stage=stage,
                               user_id=user_id,
                               proposal_id=proposal_id,
                               title=title,
                               content=content)
    db.session.add(proposal)
    db.session.commit()
