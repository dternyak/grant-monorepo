"""empty message

Revision ID: 3699cb98fc2a
Revises: e1e8573b7298
Create Date: 2018-11-08 12:33:14.995080

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3699cb98fc2a'
down_revision = 'e1e8573b7298'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comment', sa.Column('parent_comment_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'comment', 'comment', ['parent_comment_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'comment', type_='foreignkey')
    op.drop_column('comment', 'parent_comment_id')
    # ### end Alembic commands ###
